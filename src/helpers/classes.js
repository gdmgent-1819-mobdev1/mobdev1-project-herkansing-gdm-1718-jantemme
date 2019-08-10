class Student {
  constructor(userId, name, surname, email, adress, tel, school, place, status) {
    this.user_id = userId;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.adress = adress;
    this.tel = tel;
    this.school = school;
    this.place = place;
    this.status = status;
  }
}

class Kotbaas {
  constructor(userId, name, surname, email, adress, tel, place, status) {
    this.userId = userId;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.adress = adress;
    this.tel = tel;
    this.place = place;
    this.status = status;
  }
}

export {

  Student,

  Kotbaas,

};
