import json,subprocess,os,sys
root=sys.argv[1];name=sys.argv[2] if len(sys.argv)>2 else 'cap1'
# usage: python3 drama-voices.py <examples dir> [cap1|cap2...]
src='script.json' if name=='cap1' else f'script-{name}.json'
S=json.load(open(f'{root}/src/drama/{src}'))
pub=f'{root}/public/drama'+('' if name=='cap1' else f'/{name}');os.makedirs(pub,exist_ok=True);env={**os.environ,'REQUESTS_CA_BUNDLE':'/root/.ccr/ca-bundle.crt'}
dur=lambda f:float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]))
t=0;n=0;out={"scenes":[]}
for sc in S['scenes']:
    s0=t;t+=sc['pad'];lines=[]
    for ln in sc['lines']:
        v=S['voices'][ln['who']];raw=f'{pub}/raw{n}.mp3';wav=('drama/' if name=='cap1' else f'drama/{name}/')+f'l{n}.wav'
        subprocess.run(['gtts-cli','-l','es','--tld',v['tld'],ln['text'],'-o',raw],check=True,env=env)
        r=2**(v['semi']/12)
        af=(f"silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
            f"asetrate=24000*{r:.4f},aresample=44100,atempo={v['tempo']/r:.4f},volume=1.5")
        subprocess.run(['ffmpeg','-v','error','-y','-i',raw,'-af',af,f'{root}/public/{wav}'],check=True);os.remove(raw)
        if ln.get('with'):  # two characters speaking together: mix a second voice
            v2=S['voices'][ln['with']];r2=2**(v2['semi']/12);tmp=f'{pub}/w{n}.wav'
            subprocess.run(['gtts-cli','-l','es','--tld',v2['tld'],ln['text'],'-o',raw],check=True,env=env)
            af2=af.replace(f'asetrate=24000*{r:.4f}',f'asetrate=24000*{r2:.4f}').replace(f"atempo={v['tempo']/r:.4f}",f"atempo={v['tempo']/r2:.4f}")
            subprocess.run(['ffmpeg','-v','error','-y','-i',raw,'-af',af2,tmp],check=True);os.remove(raw)
            subprocess.run(['ffmpeg','-v','error','-y','-i',f'{root}/public/{wav}','-i',tmp,'-filter_complex','amix=inputs=2:normalize=0:duration=longest,volume=0.8',f'{pub}/m{n}.wav'],check=True)
            os.replace(f'{pub}/m{n}.wav',f'{root}/public/{wav}');os.remove(tmp)
        d=dur(f'{root}/public/{wav}')
        lines.append({**ln,"start":round(t,3),"dur":round(d,3),"audio":wav});t+=d+0.35;n+=1
    t+=sc.get('tail',0.5)
    out['scenes'].append({"id":sc['id'],"start":round(s0,3),"end":round(t,3),"lines":lines})
out['total']=round(t,3)
json.dump(out,open(f'{root}/src/drama/'+('timeline.json' if name=='cap1' else f'timeline-{name}.json'),'w'),ensure_ascii=False,indent=1)
print('total',out['total'],'lines',n)
