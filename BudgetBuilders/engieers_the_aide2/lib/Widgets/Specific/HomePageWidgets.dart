

import 'package:firebase_auth/firebase_auth.dart';
import 'package:engieers_the_aide/Pages/HomePage.dart';
import 'package:engieers_the_aide/Pages/IndivisualPage.dart';
import 'package:engieers_the_aide/Pages/IndustryPage.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:engieers_the_aide/Functions/BasicFunctions.dart';
import 'package:hive/hive.dart';

class drawer1 extends StatefulWidget {
  const drawer1({super.key});


  @override
  State<drawer1> createState() => _drawer1State();
}

class _drawer1State extends State<drawer1> {
  final _orderBox = Hive.box('myOrders');

  String getUser() {
    return _orderBox.get("userName");
  }
  _logoutDialogBox(BuildContext context) async {
    return showDialog<void>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Logout'),
          content: Text('Are you sure you want to logout?'),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Cancel'),
            ),
            TextButton(
              onPressed: () async{
                // Perform logout action
                await FirebaseAuth.instance.signOut();
                Navigator.of(context).pop();
              },
              child: Text('Logout'),
            ),
          ],
        );
      },
    );
  }
  @override
  Widget build(BuildContext context) {
    var create;
    return Container(
      color: Colors.amber,
      child: ListView(
        children: [
          DrawerHeader(

            child:
            Padding(
              padding: const EdgeInsets.only(right: 180.0,top: 20.0),
              child: Container(
                  child: Column(
                    children: [
                      Image.asset(
                        'assets/images/im_builder.png',
                        width: 60,
                      ),
                      Text(getUser(),style: TextStyle(fontSize: 18,fontWeight: FontWeight.w600),),
                    ],
                  ),
              ),
            ),),
          DrawerTabs(icon: Icons.home, title: "Home",fuction: (){Navigator.of(context).pop();},),
          DrawerTabs(icon: Icons.shopping_cart, title: "Services",fuction: (){}),
          DrawerTabs(icon: Icons.settings, title: "Settings",fuction: (){}),
          DrawerTabs(icon: Icons.person, title: "My Account",fuction: (){}),
          DrawerTabs(icon: Icons.data_array, title: "About Us",fuction: (){}),
           DrawerTabs(icon: Icons.logout, title: "Logout",fuction: (){_logoutDialogBox(context);})



        ],
      )
    );
  }
}








class DrawerTabs extends StatelessWidget {
  //const DrawerTabs({super.key});
  final IconData icon;
  final String title;
  final VoidCallback fuction;



  DrawerTabs({required this.icon, required this.title, required this.fuction});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: fuction,
      hoverColor: Colors.lightGreen,
      leading: Icon(icon),
      title: Text(title,),

    );
  }
}




class TopCategories extends StatelessWidget {
  const TopCategories({super.key});

  @override
  Widget build(BuildContext context) {
    List<String> options = ["Build House", "Build Stairs", "Build a Room", "Build a Room","View All","View All"];
    //List<String> optionsImages = ["im_house.png", "im_stairs.jpg", "im_room.jpg", "im_room.jpg"];

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            children: [
              Text(
                "Top Categories",
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),

            ],
          ),
        ),
        Expanded(
          child: GridView.builder(
            itemCount: options.length,
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              childAspectRatio: 2.0,
              mainAxisSpacing: 10.0,
              crossAxisSpacing: 10.0,
            ),
            itemBuilder: (context, index) {
              return Material(
                color: Colors.transparent,
                child: Card(
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text(options[index]),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

class AdBox extends StatelessWidget {
  const AdBox({super.key});

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    return SizedBox(
      height: screenSize.width * 0.7 + 200, // Adjust height to fit both ListView and TopCategories
      child: Column(
        children: [
          SizedBox(
            height: screenSize.width * 0.7, // Set the height of the carousel
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Container(
                    width: screenSize.width * 0.7,
                    color: Colors.red,
                    child: Image.asset(
                      'assets/images/im_houseAd1.jpg',
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Container(
                    width: screenSize.width * 0.7,
                    color: Colors.red,
                    child: Image.asset(
                      'assets/images/im_HouseAd2.jpg',
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Container(
                    width: screenSize.width * 0.7,
                    color: Colors.red,
                    child: Image.asset(
                      'assets/images/im_houseAd1.jpg',
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Container(
                    width: screenSize.width * 0.7,
                    color: Colors.red,
                    child: Image.asset(
                      'assets/images/im_houseAd1.jpg',
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Container(
                    width: screenSize.width * 0.7,
                    color: Colors.red,
                    child: Image.asset(
                      'assets/images/im_houseAd1.jpg',
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Expanded(child: TopCategories()),
          TextButton(onPressed: (){BasicFuctions.navigate(context, IndivisualPage());},
              child: Text(
                'View All'
              ))
        ],
      ),
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



