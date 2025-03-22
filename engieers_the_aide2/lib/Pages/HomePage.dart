import 'package:flutter/material.dart';

import '../Widgets/Specific/HomePageWidgets.dart';
import 'BottomNavigationBar.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Container(
          child: Column(
            children: [
              AdBox(),
              // Add more content here if needed
              Container(
                height: 800,
                child: Center(
                  child: Text('Scroll Down for More Content'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

