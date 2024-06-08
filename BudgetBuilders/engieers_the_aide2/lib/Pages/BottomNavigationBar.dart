
import 'package:engieers_the_aide/Functions/BasicFunctions.dart';
import 'package:engieers_the_aide/Pages/CartPage.dart';
import 'package:engieers_the_aide/Pages/HomePage.dart';
import 'package:engieers_the_aide/Pages/IndivisualPage.dart';
import 'package:engieers_the_aide/Pages/IndustryPage.dart';
import 'package:flutter/material.dart';
import '../Widgets/Specific/HomePageWidgets.dart';
import 'ProfilePage.dart';


class BottomNav extends StatefulWidget {
  const BottomNav({Key? key}) : super(key: key);

  @override
  _BottomNavState createState() => _BottomNavState();
}

class _BottomNavState extends State<BottomNav> {
  int selectedindex = 0;
  PageController pageController = PageController();
  void onTapped(int index) {
    setState(() {
      selectedindex = index;
    });
    pageController.jumpToPage(index);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Engineers-The Aide"),
        actions: [
          ElevatedButton(onPressed:(){
            BasicFuctions.navigate(context, CartPage());
          },child: Icon(Icons.shopping_cart))
        ],
      ),
      drawer: Drawer(
        child: drawer1(),
      ),
      // appBar: AppBar(title: Text('Bottom Nav')),
      body: PageView(
        controller: pageController,
        children: [
          HomePage(),
          IndivisualPage(),
          IndustryPage(),
          ProfilePage()
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
              icon: Icon(
                Icons.home,
              ),
              label: 'Home'),
          BottomNavigationBarItem(
              icon: Icon(
                Icons.person,
              ),
              label: 'People'),
          BottomNavigationBarItem(
              icon: Icon(
                Icons.factory,
              ),
              label: 'Builder'),
          BottomNavigationBarItem(
              icon: Icon(
                Icons.person,
              ),
              label: 'Profile'),
        ],
        currentIndex: selectedindex,
        selectedItemColor: Colors.green,
        unselectedItemColor: Colors.grey,
        onTap: onTapped,
      ),
    );
  }
}


