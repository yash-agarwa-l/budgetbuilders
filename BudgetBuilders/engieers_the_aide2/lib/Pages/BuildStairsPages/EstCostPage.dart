import 'package:engieers_the_aide/Functions/CartData.dart';
import 'package:engieers_the_aide/Pages/BottomNavigationBar.dart';
import 'package:engieers_the_aide/Pages/BuildHousePages/FloorsPage.dart';
import 'package:flutter/material.dart';
import 'package:hive/hive.dart';

import '../../Functions/BasicFunctions.dart';
import '../../Functions/Orders.dart';
import 'Rooms.dart';

class EstCostPage extends StatefulWidget {
  const EstCostPage({super.key});

  @override
  State<EstCostPage> createState() => _EstCostPageState();
}

class _EstCostPageState extends State<EstCostPage> {
  final _order = Hive.box('myOrders');
  void add(String estCost){
    _order.put("estCost", estCost);
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
                          decoration: InputDecoration(labelText: 'Your Offering Amount'),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter a valid Input';
                            }
                            else if(value.toString().length<4){
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


                            //CartData.addProduct()

                            BasicFuctions.navigate(context, BottomNav());
                            }
                          }, child: Text("Place Order"))
                    ],
                  ),
                ),
              ),
            )),
      ),
    );
  }
}
