export interface IAdmin {
  name: string;
  email: string;
  password: string;
}

export interface Ioptions {
  page: number;
  limit: number;
}
export interface IAppointment {
  userId: string;
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  email: string;
  mobile: string;
  department: string;
  symptoms: Array<string>;
  date: string;
  time: string;
  doctorName: string;
  doctorId: string;
  price: string;
  cancelled: boolean;
  payment: boolean;
  payment_intent: string;
  active: boolean;
}
export interface IBlog {
  title: string;
  content: string;
  imageURL: string;
}

export interface IConversation {
  members: Array<string>;
}

export interface IDept {
  name: string;
}

export interface IDoctor {
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  address: string;
  profile: string;
  photoURL: string;
  dob: string;
  department: string;
  workTime: string;
  fees: string;
  leave: Array<string>;
  password: string;
}

export interface IFeedback {
  doctorId: string;
  userId: string;
  rating: number;
  feedback: string;
}

export interface IMessage {
  conversationId: string;
  sender: string;
  text: string;
}

export interface IReportDoctor {
  doctorId: string;
  userId: string;
  reason: string;
}

export interface IUser {
  name: string;
  email: string;
  profileURL: string;
  blocked: boolean;
  prescription: Array<object>;
}
