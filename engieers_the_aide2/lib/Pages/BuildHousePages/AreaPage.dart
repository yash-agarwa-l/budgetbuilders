import 'package:engieers_the_aide/Pages/BuildHousePages/EstCostPage.dart';
import 'package:engieers_the_aide/Pages/BuildHousePages/FloorsPage.dart';
import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';

import '../../Functions/BasicFunctions.dart';
import '../../Functions/Orders.dart';
import 'Rooms.dart';

class AreaPage extends StatefulWidget {
  const AreaPage({super.key});

  @override
  State<AreaPage> createState() => _AreaPageState();
}

class _AreaPageState extends State<AreaPage> {
  final _orderBox = Hive.box('myOrders');
  Orders order = Orders();
  final _formKey = GlobalKey<FormState>();

  void add(String area) {
    _orderBox.put("area", area);
  }

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
                decoration: BoxDecoration(
                  color: Colors.cyanAccent,
                  borderRadius: BorderRadius.all(Radius.circular(30)),
                ),
                width: screenSize.width * 0.7,
                height: screenSize.height * 0.2,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: TextFormField(
                        key: ValueKey('number'),
                        decoration: InputDecoration(labelText: 'Total Area in Sq. feet'),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter a valid Input';
                          } else if (value.toString().length < 3) {
                            return 'Please enter a valid Input';
                          }
                          return null;
                        },
                        onSaved: (value) {
                          add(value.toString());
                          order.setName(value.toString());
                        },
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        if (_formKey.currentState!.validate()) {
                          _formKey.currentState!.save();
                          BasicFuctions.navigate(context, FloorPage(order: order));
                        }
                      },
                      child: Text("Next"),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
