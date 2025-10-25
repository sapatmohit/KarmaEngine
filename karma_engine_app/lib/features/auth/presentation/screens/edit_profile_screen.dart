import 'package:flutter/material.dart';
import 'package:karma_engine_app/core/models/user_model.dart';
import 'package:karma_engine_app/core/services/api_service.dart';

class EditProfileScreen extends StatefulWidget {
  final UserModel user;

  const EditProfileScreen({super.key, required this.user});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameController;
  late TextEditingController _instagramController;
  late TextEditingController _facebookController;
  late TextEditingController _twitterController;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.user.name);
    _instagramController = TextEditingController(
      text: widget.user.socialMedia?['instagram'] ?? '',
    );
    _facebookController = TextEditingController(
      text: widget.user.socialMedia?['facebook'] ?? '',
    );
    _twitterController = TextEditingController(
      text: widget.user.socialMedia?['twitter'] ?? '',
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _instagramController.dispose();
    _facebookController.dispose();
    _twitterController.dispose();
    super.dispose();
  }

  Future<void> _saveProfile() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      // TODO: Implement profile update API call
      // For now, just simulate the update
      await Future.delayed(const Duration(seconds: 2));

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Profile updated successfully!'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context, true); // Return true to indicate success
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to update profile: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Profile'),
        actions: [
          TextButton(
            onPressed: _isLoading ? null : _saveProfile,
            child: _isLoading
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Text('Save'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Profile Picture Section
              Center(
                child: Column(
                  children: [
                    Stack(
                      children: [
                        CircleAvatar(
                          radius: 60,
                          backgroundColor: Theme.of(context).primaryColor,
                          child: widget.user.avatar.isNotEmpty
                              ? ClipRRect(
                                  borderRadius: BorderRadius.circular(60),
                                  child: Image.network(
                                    widget.user.avatar,
                                    width: 120,
                                    height: 120,
                                    fit: BoxFit.cover,
                                    errorBuilder: (context, error, stackTrace) {
                                      return Text(
                                        widget.user.name
                                            .split(' ')
                                            .map((e) => e[0])
                                            .join()
                                            .toUpperCase(),
                                        style: const TextStyle(
                                          fontSize: 40,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white,
                                        ),
                                      );
                                    },
                                  ),
                                )
                              : Text(
                                  widget.user.name
                                      .split(' ')
                                      .map((e) => e[0])
                                      .join()
                                      .toUpperCase(),
                                  style: const TextStyle(
                                    fontSize: 40,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                        ),
                        Positioned(
                          bottom: 0,
                          right: 0,
                          child: Container(
                            decoration: BoxDecoration(
                              color: Theme.of(context).primaryColor,
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 2),
                            ),
                            child: IconButton(
                              icon: const Icon(Icons.camera_alt, color: Colors.white),
                              onPressed: () {
                                // TODO: Implement image picker
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Photo upload coming soon'),
                                  ),
                                );
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Tap to change profile picture',
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              // Personal Information Section
              const Text(
                'Personal Information',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),

              // Name Field
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Full Name',
                  prefixIcon: Icon(Icons.person),
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your name';
                  }
                  if (value.length < 2) {
                    return 'Name must be at least 2 characters';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Username (Read-only)
              TextFormField(
                initialValue: '@${widget.user.username}',
                decoration: const InputDecoration(
                  labelText: 'Username',
                  prefixIcon: Icon(Icons.alternate_email),
                  border: OutlineInputBorder(),
                  helperText: 'Username cannot be changed',
                ),
                enabled: false,
              ),
              const SizedBox(height: 24),

              // Social Media Section
              const Text(
                'Social Media',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),

              // Instagram Field
              TextFormField(
                controller: _instagramController,
                decoration: const InputDecoration(
                  labelText: 'Instagram',
                  prefixIcon: Icon(Icons.camera_alt),
                  border: OutlineInputBorder(),
                  hintText: '@username or profile URL',
                ),
              ),
              const SizedBox(height: 16),

              // Facebook Field
              TextFormField(
                controller: _facebookController,
                decoration: const InputDecoration(
                  labelText: 'Facebook',
                  prefixIcon: Icon(Icons.facebook),
                  border: OutlineInputBorder(),
                  hintText: 'Profile URL',
                ),
              ),
              const SizedBox(height: 16),

              // Twitter Field
              TextFormField(
                controller: _twitterController,
                decoration: const InputDecoration(
                  labelText: 'Twitter',
                  prefixIcon: Icon(Icons.alternate_email),
                  border: OutlineInputBorder(),
                  hintText: '@username',
                ),
              ),
              const SizedBox(height: 24),

              // Account Information Section
              const Text(
                'Account Information',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),

              // Read-only fields
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      _buildReadOnlyField('Wallet Address', 
                        '${widget.user.walletAddress.substring(0, 8)}...${widget.user.walletAddress.substring(widget.user.walletAddress.length - 8)}'),
                      const SizedBox(height: 12),
                      _buildReadOnlyField('Member Since', 
                        '${widget.user.createdAt.day}/${widget.user.createdAt.month}/${widget.user.createdAt.year}'),
                      const SizedBox(height: 12),
                      _buildReadOnlyField('Age Verified', 
                        widget.user.isOver18 ? 'Yes' : 'No'),
                      const SizedBox(height: 12),
                      _buildReadOnlyField('Account Status', 
                        widget.user.isActive ? 'Active' : 'Inactive'),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // Save Button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _saveProfile,
                  style: ElevatedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: _isLoading
                      ? const CircularProgressIndicator()
                      : const Text(
                          'Save Changes',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                ),
              ),
              const SizedBox(height: 16),

              // Cancel Button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: OutlinedButton(
                  onPressed: _isLoading ? null : () => Navigator.pop(context),
                  style: OutlinedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text(
                    'Cancel',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildReadOnlyField(String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 120,
          child: Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              color: Colors.grey,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ],
    );
  }
}
