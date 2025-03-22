import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;

class userAuthFunction{
   static String result='false';
  static const baseurl='http://192.168.1.5:3000/api/';

  static Future<String> createUser(String userName,String email,String password) async{
    var body2={"userName":userName,"email":email,"password":password};
    var url=Uri.parse(baseurl+"createUser");
    try{
      final res= await http.post(url,body: body2);
      if (res.statusCode==200) {
        var data = jsonDecode(res.body.toString());
        print(data);
      }
    }
    catch(e){
      debugPrint(e.toString());
    }
    return userAuthFunction.result;
    }
  }

