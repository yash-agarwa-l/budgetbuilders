

import 'package:firebase_auth/firebase_auth.dart';
import 'package:engieers_the_aide/Pages/HomePage.dart';
import 'package:engieers_the_aide/Pages/IndivisualPage.dart';
import 'package:engieers_the_aide/Pages/IndustryPage.dart';
import 'package:flutter/material.dart';

class drawer1 extends StatefulWidget {
  const drawer1({super.key});

  @override
  State<drawer1> createState() => _drawer1State();
}

class _drawer1State extends State<drawer1> {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.amber,
      child: ListView(
        children: [
          DrawerHeader(child:
            Container(

            ),),
          DrawerTabs(icon: Icons.home, title: "Home"),
          DrawerTabs(icon: Icons.shopping_cart, title: "Services"),
          DrawerTabs(icon: Icons.settings, title: "Settings"),
          DrawerTabs(icon: Icons.person, title: "My Account"),
          ElevatedButton(
            onPressed: ()async{await FirebaseAuth.instance.signOut();},
              child: DrawerTabs(icon: Icons.logout, title: "Logout"))



        ],
      )
    );
  }
}

class DrawerTabs extends StatelessWidget {
  //const DrawerTabs({super.key});
  final IconData icon;
  final String title;


  DrawerTabs({required this.icon, required this.title});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      hoverColor: Colors.lightGreen,
      leading: Icon(icon),
      title: Text(title,),

    );
  }
}






























// class TaskBar extends StatelessWidget {
//   const TaskBar({super.key});
//
//   @override
//   Widget build(BuildContext context) {
//     return BottomNavigationBar(items: const<BottomNavigationBarItem>[
//       TaskBarBut(icon: Icon(Icons.account_tree),page: (){return IndivisualPage();})
//     ]);
//     // return Row(
//     //   mainAxisAlignment: MainAxisAlignment.spaceEvenly,
//     //   children: [
//     //     TaskBarButtons(icon: Icons.home,page: (){return IndivisualPage();}),
//     //     TaskBarButtons(icon: Icons.person,page: (){return IndivisualPage();}),
//     //     TaskBarButtons(icon: Icons.account_tree,page: (){return IndustryPage();}),
//     //     TaskBarButtons(icon: Icons.person_2_rounded,page: (){return AccountPage();})
//     //   ],
//     // );
//   }
// }

// class TaskBarBut extends BottomNavigationBarItem {
//   final Widget Function() page;
//
//   const TaskBarBut({
//     super.key,
//     required super.icon,
//     super.label,
//     Widget? activeIcon,
//     super.backgroundColor,
//     super.tooltip,
//     required this.page,
//   })
//
// }
//
// class TaskBarButtons extends StatelessWidget {
//   final IconData icon;
//   final Widget Function() page;
//
//   const TaskBarButtons({
//     Key? key,
//     required this.icon,
//     required this.page,
//   }) : super(key: key);
//
//   @override
//   Widget build(BuildContext context) {
//     return ElevatedButton(onPressed: () {
//       Navigator.push(context,
//           MaterialPageRoute(builder: (context) => page()));
//     }, child: Icon(icon));
//   }
// }



