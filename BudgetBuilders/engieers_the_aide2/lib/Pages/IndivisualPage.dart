import 'package:engieers_the_aide/Functions/BasicFunctions.dart';
import 'package:engieers_the_aide/Pages/BuildHousePages/AreaPage.dart';
import 'package:engieers_the_aide/Pages/BuildHousePages/FloorsPage.dart';
import 'package:engieers_the_aide/Pages/CivilPage.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:hive/hive.dart';

class IndivisualPage extends StatefulWidget {
  const IndivisualPage({super.key});

  @override
  State<IndivisualPage> createState() => _IndivisualPageState();
}

class _IndivisualPageState extends State<IndivisualPage> {
  final _orderBox = Hive.box('myOrders');

  void add(String type) {
    _orderBox.put("type", type);
  }

  @override
  Widget build(BuildContext context) {
    List<String> options = ["Build House", "Build Stairs", "Build a Room","Build a Room"];
    List<String> optionsImages = ["im_house.png", "im_stairs.jpg", "im_room.jpg", "im_room.jpg"];

    return Scaffold(

      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text("Architecture"),
          ),
          Expanded(
            child: GridView.builder(
              itemCount: options.length,
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 1.0,
                mainAxisSpacing: 10.0,
                crossAxisSpacing: 10.0,
              ),
              itemBuilder: (context, index) {
                return Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: () {
                      if (index == 0) {
                        add("House");

                        BasicFuctions.navigate(context, AreaPage());
                      }
                    },
                    splashColor: Colors.blue.withAlpha(30),
                    highlightColor: Colors.blue.withAlpha(30),
                    child: Column(
                      children: [
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Image.asset(
                              "assets/images/" + optionsImages[index],
                              fit: BoxFit.cover,
                              width: double.infinity,
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Text(options[index]),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}


class ArchitectOptions extends StatefulWidget {
  const ArchitectOptions({super.key});

  @override
  State<ArchitectOptions> createState() => _ArchitectOptionsState();
}

class _ArchitectOptionsState extends State<ArchitectOptions> {
  @override
  Widget build(BuildContext context) {
    return DropdownButton(
      items: [],
      onChanged: (value) => null,
    );
  }
}

// Navigator.push(
// context,
// MaterialPageRoute(builder: (context) => CivilPage()));
