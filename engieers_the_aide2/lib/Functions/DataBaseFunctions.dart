import 'package:cloud_firestore/cloud_firestore.dart';

class create22 {
  static void basic(String colName,String docName,String name) async{
  await FirebaseFirestore.instance.
  collection(colName).doc(docName).set({
    'userName':name,
  });
  }
}


class create{
  static String? userName;
  static String? email;
  static String? phoneno;
  static String? address;
  static String colName="UserName";



  //create({required this.userName});
  static void setcolName(String colname) {
    if (colname.isNotEmpty) {
      create.userName = colname;
    } else {
      print('Name cannot be empty');
    }
  }

  static void setName(String name) {
    if (name.isNotEmpty) {
      create.userName = name;
    } else {
      print('Name cannot be empty');
    }
  }

  static void setEmail(String email) {
    if (email.isNotEmpty) {
      create.email = email;
    }
  }
  static void setPhoneNo(String phoneNo) {
    if (phoneNo.isNotEmpty) {
      create.phoneno = phoneNo;
    }
  }
  static void setAdress(String adress) {
    if (adress.isNotEmpty) {
      create.address = adress;
    }
  }


  static void commit() async{
    await FirebaseFirestore.instance.
    collection('Profiles').doc(colName).set({'Profile':{
      'userName':userName,
      'email':email,
      'phoneNo':phoneno,
      'address':address

    }});
    print("data added");

  }
}
