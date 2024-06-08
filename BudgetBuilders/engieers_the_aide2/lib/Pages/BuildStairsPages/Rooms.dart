import 'package:engieers_the_aide/Functions/Orders.dart';
import 'package:engieers_the_aide/Pages/BuildHousePages/EstCostPage.dart';
import 'package:flutter/material.dart';
import 'package:hive/hive.dart';

import '../../Functions/BasicFunctions.dart';
class Rooms extends StatefulWidget {
  Rooms({super.key});

  @override
  State<Rooms> createState() => _RoomsState();
}

class _RoomsState extends State<Rooms> {
  final _order = Hive.box('myOrders');
  void add(String rooms){
    _order.put("rooms", rooms);
  }

  void read(String data){
    print(_order.get(data));
  }

  final _formKey = GlobalKey<FormState>();
  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    return Scaffold(
      body: Form(
        key: _formKey,
        child: Center(
            child: Container(
              child: Center(
                child: Container(
                  decoration: BoxDecoration(color: Colors.cyanAccent,borderRadius: BorderRadius.all(Radius.circular(30))),
                  width: screenSize.width*0.7,
                  height: screenSize.height*0.2,

                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: TextFormField(
                          key: ValueKey('number'),
                          decoration: InputDecoration(labelText: 'Number of Rooms'),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter a valid Input';
                            }
                            else if(value.toString().length>3){
                              return 'Please enter a valid Input';
                            }
                            return null;
                          },
                          onSaved: (value) {
                                  add(value.toString());
                          },
                        ),
                      ),
                      ElevatedButton(
                          onPressed: (){
                            if (_formKey.currentState!.validate()) {
                              _formKey.currentState!.save();


                              BasicFuctions.navigate(context, EstCostPage());
                            }
                            }, child: Text("Next")),
                      //ElevatedButton(onPressed: ()=>read("floors"), child: Text("show"))
                    ],
                  ),
                ),
              ),
            )),
      ),
    );
  }

}
