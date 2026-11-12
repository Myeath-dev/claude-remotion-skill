import numpy as np,wave,sys
sr=44100;D=28.5;t=np.arange(int(sr*D))/sr;a=np.zeros_like(t)
def add(s,at):
    i=int(at*sr);n=min(len(s),len(a)-i);a[i:i+n]+=s[:n]
# kick + hat at 120bpm
for b in np.arange(0,D,0.5):
    x=np.arange(int(.25*sr))/sr;add(.55*np.sin(2*np.pi*(50+90*np.exp(-x*30))*x)*np.exp(-x*12),b)
    x=np.arange(int(.05*sr))/sr;add(.06*np.random.randn(len(x))*np.exp(-x*80),b+.25)
# pad chords (I-V-vi-IV in C)
ch=[[261.6,329.6,392],[196,246.9,293.7],[220,261.6,329.6],[174.6,220,261.6]]
for k,s in enumerate(np.arange(0,D,2)):
    x=np.arange(int(2*sr))/sr;env=np.minimum(1,x*4)*np.minimum(1,(2-x)*4)
    add(sum(.05*np.sin(2*np.pi*f*x)+.03*np.sin(2*np.pi*f*1.003*x) for f in ch[k%4])*env,s)
# pops on entrances
def pop(at,f=900):
    x=np.arange(int(.12*sr))/sr;add(.35*np.sin(2*np.pi*f*np.exp(-x*8)*x*3)*np.exp(-x*30),at)
for at in [0.1,0.9]: pop(at)
for i in range(5): pop(2.6+i*1.8,700);pop(3.15+i*1.8,1100)
pop(11.6);[pop(13.35+i*2.1,800) for i in range(3)]
[pop(20.1+i*1.7,1000+i*150) for i in range(3)];pop(26.2,600)
fade=np.minimum(1,(D-t)/1.5);a=np.clip(a*fade,-1,1)
w=wave.open(sys.argv[1],'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((a*32000).astype(np.int16).tobytes())
