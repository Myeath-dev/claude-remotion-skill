import json,subprocess,os,sys
root=sys.argv[1];S=json.load(open(f'{root}/src/drama/script.json'))
pub=f'{root}/public/drama';env={**os.environ,'REQUESTS_CA_BUNDLE':'/root/.ccr/ca-bundle.crt'}
dur=lambda f:float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]))
t=0;n=0;out={"scenes":[]}
for sc in S['scenes']:
    s0=t;t+=sc['pad'];lines=[]
    for ln in sc['lines']:
        v=S['voices'][ln['who']];raw=f'{pub}/raw{n}.mp3';wav=f'drama/l{n}.wav'
        subprocess.run(['gtts-cli','-l','es','--tld',v['tld'],ln['text'],'-o',raw],check=True,env=env)
        r=2**(v['semi']/12)
        af=(f"silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
            f"asetrate=24000*{r:.4f},aresample=44100,atempo={v['tempo']/r:.4f},volume=1.5")
        subprocess.run(['ffmpeg','-v','error','-y','-i',raw,'-af',af,f'{root}/public/{wav}'],check=True);os.remove(raw)
        d=dur(f'{root}/public/{wav}')
        lines.append({**ln,"start":round(t,3),"dur":round(d,3),"audio":wav});t+=d+0.35;n+=1
    t+=sc.get('tail',0.5)
    out['scenes'].append({"id":sc['id'],"start":round(s0,3),"end":round(t,3),"lines":lines})
out['total']=round(t,3)
json.dump(out,open(f'{root}/src/drama/timeline.json','w'),ensure_ascii=False,indent=1)
print('total',out['total'],'lines',n)
