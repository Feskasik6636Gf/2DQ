import json
T=json.load(open('src/story/timeline.json'))
L={l['id'][:3]:l for l in T['lines']}
def off(n,word=None,nth=0,d=0):
    if word is None: return d
    ws=[w for w in L[n]['words'] if w[0]==word]
    return (ws[min(nth,len(ws)-1)][1] if ws else 0)+d
amb=[('001','002','hall',.05),('002','003','night',.05),('003','007','hall',.05),('007','008','street',.06),('008','016','room',.04),('016','020','wind',.03),
('020','022','street',.05),('022','023','hall',.05),('023','029','room',.04),('029','033','room',.04),('033','050','hall',.05),('050','052','crowd',.05),
('052','054','street',.05),('054','061','crowd',.05),('061','066','fridge',.05),('066','068','street',.05),('068','072','room',.04),('072','074','room',.04),
('074','078','street',.06),('078','079','crowd',.07),('079','086','room',.04),('086','087','crowd',.07),('087','098','wind',.03),('098','104','fridge',.05),
('104','108','crowd',.05),('108','112','room',.04),('112','127','rain',.07),('127','130','hall',.05),('130','141','night',.04),('141','166','night',.04),
('166','167','wind',.04),('167','184','hall',.05),('184','189','night',.05),('189','196','wind',.03),('196','204','street',.05),('204','207','street',.05),
('207','210','room',.04),('210','end','wind',.03)]
ambience=[{'from':a,'to':b,'kind':k,'gain':g,**({'birds':True} if k=='street' else {})} for a,b,k,g in amb]
S=[('001',None,0,'steps',{'dur':0.9}),('001','homework',4,'thud',{}),('002','two',0,'ding',{}),('003','oldest',0,'whooshUp',{}),('004','dog',8,'pop',{}),('004','it',20,'stamp',{}),
('005',None,4,'clap',{}),('006','knows',0,'pop',{}),('007',None,2,'steps',{'dur':1.4}),('008','dog',0,'thud',{}),('009','big',0,'pop',{}),('009','brown',0,'pop',{}),('009','slobbery',0,'pop',{}),('009','math',0,'pop',{}),
('010',None,0,'steps',{'dur':1.2}),('010','did',0,'chat',{}),('011','six',0,'ding',{}),('012',None,0,'click',{}),('012',None,14,'click',{}),('012',None,28,'click',{}),('013','leash',0,'pop',{}),('013','exact',-10,'whoosh',{}),('013','exact',8,'thud',{}),
('014',None,6,'ding',{}),('015',None,10,'whooshUp',{}),('016',None,0,'steps',{'dur':1.2}),('017','true',0,'whooshUp',{}),('017','true',0,'thud',{}),('018','big',0,'stamp',{}),('018','erases',0,'swoosh',{}),('019','hardest',0,'heartbeat',{}),
('020',None,0,'steps',{'dur':2.0}),('020',None,10,'whoosh',{}),('021',None,8,'pop',{}),('022',None,12,'thud',{}),('022','fine',0,'pop',{}),('023',None,0,'sent',{}),('023','love',0,'pop',{}),('024','most',20,'ding',{}),
('027','realize',0,'heartbeat',{}),('028',None,0,'steps',{'dur':2.0}),('029','cookie',-20,'chat',{}),('030',None,8,'thud',{}),('030','no',0,'pop',{}),('030','no',30,'stamp',{}),('031','opens',4,'pop',{}),('031','full',-10,'swoosh',{}),('031','full',0,'ding',{}),
('032',None,0,'pop',{}),('032',None,12,'pop',{}),('032','five',0,'ding',{}),('033',None,0,'steps',{'dur':1.0}),('034','yeah',0,'pop',{}),('034','yeah',30,'stamp',{}),('035','know',0,'ding',{}),('036',None,4,'pop',{}),('036','name',0,'pop',{}),
('037',None,0,'whoosh',{}),('038',None,4,'swoosh',{}),('039','hundred',0,'stamp',{}),('039','fun',0,'clap',{}),('041',None,10,'pop',{}),('042','dares',0,'pop',{}),('043',None,0,'steps',{'dur':1.2}),('043','hey',0,'pop',{}),('043','hey',30,'stamp',{}),
('044','never',0,'swoosh',{}),('045',None,0,'ding',{}),('046','lake',0,'splash',{}),('047',None,6,'crackle',{}),('048','you',0,'pop',{}),('049','lunch',0,'ding',{}),('050','cuts',-14,'whoosh',{}),('050','cuts',6,'thud',{}),
('051','actually',0,'pop',{}),('051','actually',26,'stamp',{}),('052','owns',0,'ding',{}),('053','ketchup',0,'pop',{}),('054','asks',0,'chat',{}),('054','r',0,'thud',{}),('055','18',0,'pop',{}),('055','18',10,'stamp',{}),
('056',None,2,'whooshUp',{}),('056','beard',0,'pop',{}),('057',None,0,'steps',{'dur':1.5}),('057','just',0,'pop',{}),('058','again',-20,'pop',{}),('058','again',-20,'swoosh',{}),('059',None,20,'thud',{}),('060',None,0,'whooshUp',{}),
('061',None,20,'pop',{}),('062',None,0,'swoosh',{}),('063',None,0,'click',{}),('063',None,16,'click',{}),('063',None,32,'click',{}),('065','millionaire',0,'stamp',{}),('065','millionaire',8,'thud',{}),('066','car',0,'ding',{}),
('067','anymore',0,'pop',{}),('067','anymore',0,'swoosh',{}),('068','assistant',-10,'steps',{'dur':0.8}),('069',None,0,'ring',{'dur':2.0}),('070','bank',0,'ding',{}),('072',None,20,'chat',{}),('073',None,0,'sent',{}),('073',None,14,'stamp',{}),
('074','backyard',0,'clap',{}),('074','happy',0,'clap',{}),('075',None,0,'steps',{'dur':1.0}),('076','we',0,'pop',{}),('076','we',26,'stamp',{}),('077','bad',0,'thud',{}),('078','tourists',0,'pop',{}),('078','owner',0,'whoosh',{}),
('079',None,0,'click',{}),('079',None,10,'click',{}),('080','screaming',0,'pop',{}),('081','love',0,'pop',{}),('081','love',10,'stamp',{}),('082','do',0,'ding',{}),('083',None,0,'steps',{'dur':3.0}),('084',None,26,'chat',{}),
('085','my',0,'pop',{}),('085','my',30,'stamp',{}),('086',None,0,'clap',{}),('086','eight',0,'ding',{}),('087',None,4,'whooshUp',{}),('088',None,4,'click',{}),('089',None,0,'thud',{}),('090','stay',0,'pop',{}),('090','stay',10,'pop',{}),
('091','brain',0,'buzz',{'dur':1.5}),('092','emotion',0,'heartbeat',{}),('094',None,0,'swoosh',{}),('095',None,0,'whooshUp',{}),('096',None,4,'stamp',{}),('096',None,14,'stamp',{}),('096',None,24,'stamp',{}),('097','wrong',0,'thud',{}),
('099',None,0,'click',{}),('100','weekend',0,'swoosh',{}),('101',None,0,'birds',{}),('102',None,10,'swoosh',{}),('103',None,0,'heartbeat',{}),('104',None,4,'chat',{}),('105','lake',0,'splash',{}),('105','campfire',0,'crackle',{}),
('107','fake',0,'stamp',{}),('108','sick',0,'pop',{}),('108','sick',16,'stamp',{}),('109','fever',0,'alarm',{}),('110','fine',0,'pop',{}),('110','fine',16,'stamp',{}),('111',None,22,'pop',{}),('111','changing',0,'swoosh',{}),
('112','worst',0,'thud',{}),('113','money',-14,'ding',{}),('114','grabs',0,'thud',{}),('115',None,2,'pop',{}),('117','did',0,'heartbeat',{}),('121','cruelest',0,'heartbeat',{}),('122',None,2,'thud',{}),('122',None,2,'whooshUp',{}),
('124','blinks',0,'pop',{}),('126','walks',0,'steps',{'dur':2.0}),('128',None,10,'swoosh',{}),('130','gone',0,'swoosh',{}),('131','missing',0,'swoosh',{}),('133','kai',0,'pop',{}),('135','true',0,'stamp',{}),('136','first',10,'ding',{}),
('138','say',10,'pop',{}),('139','truth',0,'thud',{}),('140',None,20,'thud',{}),('143','that',0,'ding',{}),('144','every',0,'stamp',{}),('145','test',4,'stamp',{}),('145','dad',4,'stamp',{}),('145','summer',4,'stamp',{}),('146','erased',0,'swoosh',{}),
('148','one',0,'ding',{}),('149',None,0,'whooshUp',{}),('150',None,0,'swoosh',{}),('151','money',0,'whoosh',{}),('154','wags',0,'pop',{}),('157','walk',0,'steps',{'dur':2.0}),('158',None,0,'ring',{'dur':1.0}),('159','again',0,'click',{}),
('162',None,0,'steps',{'dur':0.5}),('165','biggest',0,'heartbeat',{}),('166',None,20,'whooshUp',{}),('167',"where's",0,'thud',{}),('169',None,0,'swoosh',{}),('171','kai',0,'ding',{}),('174',"don't",0,'swoosh',{}),('175','games',4,'stamp',{}),
('176','silent',0,'heartbeat',{}),('179',None,4,'stamp',{}),('182','glad',20,'ding',{}),('184','night',10,'steps',{'dur':2.0}),('186',None,0,'click',{}),('186',None,24,'click',{}),('190','coin',-10,'click',{}),('191',None,0,'pop',{}),
('194',None,4,'click',{}),('194',None,10,'click',{}),('194',None,16,'click',{}),('194',None,22,'click',{}),('196',None,0,'steps',{'dur':1.5}),('199',None,0,'steps',{'dur':1.5}),('201','say',4,'stamp',{}),('202',None,2,'clap',{}),
('204',None,0,'steps',{'dur':4.0}),('206','biscuit',0,'ding',{}),('207',None,0,'steps',{'dur':1.2}),('207','do',0,'chat',{}),('209','yeah',-10,'steps',{'dur':0.6}),('209','yeah',20,'clap',{}),('212','like',10,'click',{}),('212','subscribe',10,'ding',{})]
sfx=[]
for n,word,d,typ,ex in S:
    sfx.append({'at':n,'off':off(n,word,0,d),'type':typ,**ex})
json.dump({'ambience':ambience,'music':[],'sfx':sfx},open('src/story/sound.json','w'),indent=0)
print(len(sfx),'sfx')
