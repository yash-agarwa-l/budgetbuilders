import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;

class userAuthFunction{

  static const baseurl='http://192.168.1.5:3000/api/createOrder/';

  createOrder(String area,String floor,String rooms,String estCost) async{
    var body2={"area":area,"floor":floor,"rooms":rooms,"estCost":estCost};
    var url=Uri.parse(baseurl+"house");
    try{
      final res= await http.post(url,body: body2);
      if (res.statusCode==200) {
        var data = jsonDecode(res.body.toString());
        print(data);
      }
      else{
        print("Error");
      }

    }
    catch(e){
      debugPrint(e.toString());
    }

  }
}
