import 'package:flutter/material.dart';

import '../Widgets/Specific/HomePageWidgets.dart';
import 'BottomNavigationBar.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(

      body: SingleChildScrollView(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.end,
            children: [BottomNav()]),
      ),
    );
  }
}
