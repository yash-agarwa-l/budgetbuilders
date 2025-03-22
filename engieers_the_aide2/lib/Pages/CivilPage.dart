import 'package:flutter/material.dart';
class CivilPage extends StatelessWidget {
  const CivilPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Civil Page"),
      ),
      body: GridView(
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 3),
        children: [
          InkWell(
            child: Container(
            child: Text(""),
            ),
            onTap: (){},
          )
        ],
      )
    );
  }
}
