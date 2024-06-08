import 'package:cloud_firestore/cloud_firestore.dart';

class Orders2 {
  static void basic(String colName,String docName,String name) async{
    await FirebaseFirestore.instance.
    collection(colName).doc(docName).set({
      'userName':name,
    });
  }
}


class Orders{
  String? userName;
  String? floors;
  String? rooms;
  String? estCost;
  //static String UserName="UserName";


  //create({required this.userName});


  void setName(String name) {
    if (name.isNotEmpty) {
      this.userName = name;
      print("Order name set");
    } else {
      print('Name cannot be empty');
    }
  }

  void setFloor(String floors) {
    if (floors.isNotEmpty) {
      this.floors = floors;
    }
  }
  void setRooms(String rooms) {
    if (rooms.isNotEmpty) {
      this.rooms = rooms;
    }
  }
  void setEstCost(String estCost) {
    if (estCost.isNotEmpty) {
      this.estCost = estCost;
    }
  }


  // static void commit() async{
  //   await FirebaseFirestore.instance.
  //   collection('Profiles').doc(userName).set({'Orders':{
  //     'userName':userName,
  //     'floors':floors,
  //     'rooms':rooms,
  //     'estCost':estCost
  //
  //   }});
  //   print("data added");
  //
  // }
}
