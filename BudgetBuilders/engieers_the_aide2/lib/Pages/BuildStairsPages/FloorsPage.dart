import 'package:engieers_the_aide/Functions/BasicFunctions.dart';
import 'package:engieers_the_aide/Functions/Orders.dart';
import 'package:engieers_the_aide/Pages/BuildHousePages/Rooms.dart';
import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:engieers_the_aide/main.dart';
class FloorPage extends StatefulWidget {
  Orders order;
  FloorPage({super.key,required this.order});

  @override
  State<FloorPage> createState() => _FloorPageState();
}

class _FloorPageState extends State<FloorPage> {
  final _order = Hive.box('myOrders');
  void add(String floors){
    _order.put("floors", floors);
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
                          decoration: InputDecoration(labelText: 'Number of floors'),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter a valid Input';
                            }
                            else if(value.toString().length>=3){
                              return 'Please enter a valid Input';
                            }
                            return null;
                          },
                          onSaved: (value) { setState(() {
                            add(value.toString());
                          });

                          },
                        ),
                      ),
                      ElevatedButton(
                          onPressed: (){
                            if (_formKey.currentState!.validate()) {
                              _formKey.currentState!.save();



                              BasicFuctions.navigate(context, Rooms());
                            }
                            }, child: Text("Next"))
                    ],
                  ),
                ),
              ),
            )),
      ),
    );
  }
}
