import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass } from '@typegoose/typegoose';

export class Candidate {
  @prop()
  title: string;

  @prop({ unique: true })
  emailAddress: string;    

  @prop({ required: true })
  firstName: string;  

  @prop({ required: true })
  lastName: string;  

  @prop()
  note?: string ;

  @prop()
  prefix?: string ;

  @prop()
  tags: string[] ;

  @prop({ default: false})
  replied?: boolean ;

  @prop({ default: false })
  disabled?: boolean ;

  @prop()
  createdAt?: Date;

  @prop()
  updatedAt?: Date;
  
}


export class CandidateList {
  @prop()
  title: string;

  @prop({ ref: Candidate })
  batch: Ref<Candidate>[];  

  @prop({ ref: Candidate })
  candidates: Ref<Candidate>[];  

  @prop()
  createdAt?: Date;

  @prop()
  updatedAt?: Date;
  
}


export class EmailBatch {
  @prop()
  title: string;

  @prop({ ref: Candidate })
  candidates: Ref<Candidate>[];  

  @prop()
  createdAt?: Date;

  @prop()
  updatedAt?: Date;
  
}

enum ScheduleStatus{
  NotStarted,
  InProgress,
  PartialSuccess,
  Success,
}

export class EmailTemplate {
  @prop()
  title: string;

  @prop()
  template: string ;
}

export class EmailSchedule {

  @prop({ ref: EmailBatch,required: true })
  batch: Ref<EmailBatch>;  

  @prop()
  title: string ;

  @prop({ ref: EmailTemplate })
  template?: Ref<EmailTemplate>;

  @prop()
  content: string;

  @prop({ enum:ScheduleStatus })
  status:string; 

  @prop()
  scheduleAt: Date;
  
  @prop({ default: false })
  disabled?: boolean ;

  @prop()
  createdAt?: Date;

  @prop()
  updatedAt?: Date;  
}


export const CandidateModel = getModelForClass(Candidate);
