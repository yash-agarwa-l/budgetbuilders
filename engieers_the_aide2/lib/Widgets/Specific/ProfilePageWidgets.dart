import 'package:engieers_the_aide/Functions/DataBaseFunctions.dart';
import 'package:flutter/material.dart';

class ManageAccount extends StatefulWidget {
  const ManageAccount({super.key});

  @override
  State<ManageAccount> createState() => _ManageAccountState();
}

class _ManageAccountState extends State<ManageAccount> {
  final _formKey = GlobalKey<FormState>();
  //final create user = create();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Manage Your Account")),
      body: Form(
        key: _formKey,
        child: Container(
          color: Colors.white,
          padding: EdgeInsets.all(16.0),
          child: Column(
            children: [
              TextFormField(
                key: ValueKey('userName'),
                decoration: InputDecoration(labelText: 'User Name'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a valid user name';
                  }
                  return null;
                },
                onSaved: (value) {
                  create.setName(value.toString());
                },
              ),
              TextFormField(
                key: ValueKey('email'),
                decoration: InputDecoration(labelText: 'Email'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a valid email';
                  }
                  return null;
                },
                onSaved: (value) {
                  create.setEmail(value.toString());
                },
              ),
              TextFormField(
                key: ValueKey('phoneno'),
                decoration: InputDecoration(labelText: 'Phone No'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a valid phone number';
                  }
                  return null;
                },
                onSaved: (value) {
                  create.setPhoneNo(value.toString());
                },
              ),
              TextFormField(
                key: ValueKey('address'),
                decoration: InputDecoration(labelText: 'Address'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a valid address';
                  }
                  return null;
                },
                onSaved: (value) {
                  create.setAdress(value.toString());
                },
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    _formKey.currentState!.save();
                    create.commit();
                  }
                },
                child: Text("Save"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}














// UserDetailTab(field: 'email', user: user),
// UserDetailTab(field: 'phoneno', user: user),
// UserDetailTab(field: 'address', user: user),
//
// class UserDetailTab extends StatefulWidget {
//   // UserDetailTab({super.key});
//
//   final String field;
//   final create user;
//   UserDetailTab({
//     required this.field,
//     required this.user,
//     Key? key,
//   }) : super(key: key);
//   @override
//   State<UserDetailTab> createState() => _UserDetailTabState();
// }
//
// class _UserDetailTabState extends State<UserDetailTab> {
//   @override
//   Widget build(BuildContext context) {
//     return TextFormField(
//       key: ValueKey(widget.field),
//       onSaved: (value) {
//         if (widget.field == 'username') {
//           setState(() {
//             widget.user.setName(value.toString());
//           });
//         }
//         if (widget.field == 'phoneno') {
//           setState(() {
//             widget.user.setPhoneNo(value.toString());
//           });
//         }
//         if (widget.field == 'email') {
//           setState(() {
//             widget.user.setEmail(value.toString());
//           });
//         }
//         if (widget.field == 'address') {
//           setState(() {
//             widget.user.setAdress(value.toString());
//           });
//         }
//       },
//     );
//   }
// }

//class _ManageAccountState extends State<ManageAccount> {
// //   create user = new create(userName: "userName");
// //   @override
// //   Widget build(BuildContext context) {
// //     return Scaffold(
// //       appBar: AppBar(title: Text("Manage Your Account")),
// //       body: Form(
// //           child: Container(
// //         color: Colors.white,
// //         child: Column(
// //           children: [
// //             UserDetailTab(
// //               field: 'username',
// //               user: user,
// //             ),
// //             UserDetailTab(field: 'email', user: user),
// //             UserDetailTab(field: 'phoneno', user: user),
// //             UserDetailTab(field: 'address', user: user),
// //             ElevatedButton(
// //                 onPressed: () {
// //                   user.commit();
// //                 },
// //                 child: Text("Save"))
// //           ],
// //         ),
// //       )),
// //     );
// //   }
// // }
