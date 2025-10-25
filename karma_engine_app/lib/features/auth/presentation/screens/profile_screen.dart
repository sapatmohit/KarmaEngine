import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:karma_engine_app/features/auth/presentation/screens/login_screen.dart';
import 'package:karma_engine_app/features/auth/presentation/screens/edit_profile_screen.dart';
import 'package:karma_engine_app/features/auth/presentation/widgets/profile_stats_widget.dart';
import 'package:karma_engine_app/features/auth/presentation/widgets/profile_achievements_widget.dart';
import 'package:karma_engine_app/core/services/api_service.dart';
import 'package:karma_engine_app/core/models/user_model.dart';
import 'package:karma_engine_app/core/models/activity_model.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:karma_engine_app/core/utils/constants.dart';
import 'package:intl/intl.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> with SingleTickerProviderStateMixin {
  UserModel? currentUser;
  List<ActivityModel> recentActivities = [];
  bool isLoading = true;
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    _loadUserData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    final walletAddress = prefs.getString(Constants.walletAddressKey) ?? '';

    if (walletAddress.isNotEmpty) {
      try {
        // Load user data and activities in parallel
        final userFuture = ApiService().getUserByWallet(walletAddress);
        final activitiesFuture = ApiService().getUserActivities(walletAddress);

        final results = await Future.wait([userFuture, activitiesFuture]);
        
        setState(() {
          currentUser = results[0] as UserModel;
          recentActivities = results[1] as List<ActivityModel>;
          isLoading = false;
        });
      } catch (e) {
        setState(() {
          isLoading = false;
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to load profile: ${e.toString()}'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    } else {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> _logout() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Logout'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(Constants.walletAddressKey);

      if (mounted) {
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => const LoginScreen()),
          (route) => false,
        );
      }
    }
  }

  void _copyToClipboard(String text) {
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Copied to clipboard'),
        duration: Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return Scaffold(
        appBar: AppBar(title: const Text('Profile')),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (currentUser == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Profile')),
        body: const Center(
          child: Text('Failed to load profile data'),
        ),
      );
    }

    return Scaffold(
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxIsScrolled) {
          return [
            SliverAppBar(
              expandedHeight: 200,
              floating: false,
              pinned: true,
              flexibleSpace: FlexibleSpaceBar(
                background: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Theme.of(context).primaryColor,
                        Theme.of(context).primaryColor.withOpacity(0.8),
                      ],
                    ),
                  ),
                  child: SafeArea(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const SizedBox(height: 20),
                        // Profile Avatar
                        CircleAvatar(
                          radius: 50,
                          backgroundColor: Colors.white,
                          child: currentUser!.avatar.isNotEmpty
                              ? ClipRRect(
                                  borderRadius: BorderRadius.circular(50),
                                  child: Image.network(
                                    currentUser!.avatar,
                                    width: 100,
                                    height: 100,
                                    fit: BoxFit.cover,
                                    errorBuilder: (context, error, stackTrace) {
                                      return Text(
                                        currentUser!.name.split(' ').map((e) => e[0]).join().toUpperCase(),
                                        style: TextStyle(
                                          fontSize: 32,
                                          fontWeight: FontWeight.bold,
                                          color: Theme.of(context).primaryColor,
                                        ),
                                      );
                                    },
                                  ),
                                )
                              : Text(
                                  currentUser!.name.split(' ').map((e) => e[0]).join().toUpperCase(),
                                  style: TextStyle(
                                    fontSize: 32,
                                    fontWeight: FontWeight.bold,
                                    color: Theme.of(context).primaryColor,
                                  ),
                                ),
                        ),
                        const SizedBox(height: 12),
                        // User Name
                        Text(
                          currentUser!.name,
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        // Username
                        Text(
                          '@${currentUser!.username}',
                          style: const TextStyle(
                            fontSize: 16,
                            color: Colors.white70,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              actions: [
                IconButton(
                  icon: const Icon(Icons.edit, color: Colors.white),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => EditProfileScreen(user: currentUser!),
                      ),
                    ).then((_) => _loadUserData()); // Refresh data when returning
                  },
                ),
                PopupMenuButton<String>(
                  icon: const Icon(Icons.more_vert, color: Colors.white),
                  onSelected: (value) {
                    switch (value) {
                      case 'logout':
                        _logout();
                        break;
                      case 'settings':
                        // TODO: Navigate to settings
                        break;
                    }
                  },
                  itemBuilder: (context) => [
                    const PopupMenuItem(
                      value: 'settings',
                      child: Row(
                        children: [
                          Icon(Icons.settings),
                          SizedBox(width: 8),
                          Text('Settings'),
                        ],
                      ),
                    ),
                    const PopupMenuItem(
                      value: 'logout',
                      child: Row(
                        children: [
                          Icon(Icons.logout, color: Colors.red),
                          SizedBox(width: 8),
                          Text('Logout', style: TextStyle(color: Colors.red)),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ];
        },
        body: Column(
          children: [
            // Stats Row
            Container(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                      'Karma Points',
                      currentUser!.karmaPoints.toString(),
                      Icons.star,
                      Colors.orange,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildStatCard(
                      'Staked',
                      currentUser!.stakedAmount.toStringAsFixed(0),
                      Icons.savings,
                      Colors.green,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildStatCard(
                      'Multiplier',
                      '${currentUser!.multiplier}x',
                      Icons.trending_up,
                      Colors.blue,
                    ),
                  ),
                ],
              ),
            ),
            
            // Tab Bar
            TabBar(
              controller: _tabController,
              isScrollable: true,
              tabs: const [
                Tab(text: 'Overview'),
                Tab(text: 'Stats'),
                Tab(text: 'Achievements'),
                Tab(text: 'Settings'),
              ],
            ),
            
            // Tab Content
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildOverviewTab(),
                  _buildStatsTab(),
                  _buildAchievementsTab(),
                  _buildSettingsTab(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, size: 24, color: color),
            const SizedBox(height: 8),
            Text(
              value,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              title,
              style: const TextStyle(
                fontSize: 12,
                color: Colors.grey,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOverviewTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Personal Information
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Personal Information',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  _buildInfoRow('Full Name', currentUser!.name),
                  _buildInfoRow('Username', '@${currentUser!.username}'),
                  _buildInfoRow('Member Since', DateFormat('MMMM yyyy').format(currentUser!.createdAt)),
                  _buildInfoRow('Age Verified', currentUser!.isOver18 ? 'Yes' : 'No'),
                  _buildInfoRow('Status', currentUser!.isActive ? 'Active' : 'Inactive'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          
          // Wallet Information
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Wallet Information',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const Icon(Icons.account_balance_wallet, size: 20),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Stellar Address',
                              style: TextStyle(fontSize: 12, color: Colors.grey),
                            ),
                            Text(
                              '${currentUser!.walletAddress.substring(0, 8)}...${currentUser!.walletAddress.substring(currentUser!.walletAddress.length - 8)}',
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.copy, size: 20),
                        onPressed: () => _copyToClipboard(currentUser!.walletAddress),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          
          // Social Media
          if (currentUser!.socialMedia != null && currentUser!.socialMedia!.isNotEmpty)
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Social Media',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 16),
                    ...currentUser!.socialMedia!.entries.map((entry) {
                      if (entry.value.isNotEmpty) {
                        return _buildSocialMediaRow(entry.key, entry.value);
                      }
                      return const SizedBox.shrink();
                    }).toList(),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildStatsTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: ProfileStatsWidget(
        user: currentUser!,
        activities: recentActivities,
      ),
    );
  }

  Widget _buildAchievementsTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: ProfileAchievementsWidget(
        user: currentUser!,
        activities: recentActivities,
      ),
    );
  }

  Widget _buildActivityTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Recent Activities',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          if (recentActivities.isEmpty)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(32),
                child: Center(
                  child: Column(
                    children: [
                      Icon(Icons.inbox, size: 48, color: Colors.grey),
                      SizedBox(height: 16),
                      Text('No activities yet'),
                    ],
                  ),
                ),
              ),
            )
          else
            ...recentActivities.map((activity) => Card(
              child: ListTile(
                leading: CircleAvatar(
                  backgroundColor: Theme.of(context).primaryColor.withOpacity(0.1),
                  child: Icon(
                    _getActivityIcon(activity.type),
                    color: Theme.of(context).primaryColor,
                  ),
                ),
                title: Text(activity.displayType),
                subtitle: Text(DateFormat('MMM dd, yyyy • HH:mm').format(activity.timestamp)),
                trailing: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      '+${activity.finalKarma}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.green,
                      ),
                    ),
                    Text(
                      '${activity.multiplier}x',
                      style: const TextStyle(
                        fontSize: 12,
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),
              ),
            )).toList(),
        ],
      ),
    );
  }

  Widget _buildSettingsTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Card(
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.edit),
                  title: const Text('Edit Profile'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => EditProfileScreen(user: currentUser!),
                      ),
                    ).then((_) => _loadUserData());
                  },
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.security),
                  title: const Text('Security Settings'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Security settings coming soon')),
                    );
                  },
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.notifications),
                  title: const Text('Notifications'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Notification settings coming soon')),
                    );
                  },
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.help),
                  title: const Text('Help & Support'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Help & support coming soon')),
                    );
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _logout,
              icon: const Icon(Icons.logout),
              label: const Text('Logout'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
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
      ),
    );
  }

  Widget _buildSocialMediaRow(String platform, String value) {
    IconData icon;
    switch (platform.toLowerCase()) {
      case 'instagram':
        icon = Icons.camera_alt;
        break;
      case 'twitter':
        icon = Icons.alternate_email;
        break;
      case 'facebook':
        icon = Icons.facebook;
        break;
      default:
        icon = Icons.link;
    }

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.grey),
          const SizedBox(width: 12),
          Text(
            platform.toUpperCase(),
            style: const TextStyle(
              fontSize: 12,
              color: Colors.grey,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(width: 16),
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
      ),
    );
  }

  IconData _getActivityIcon(String type) {
    switch (type) {
      case 'post':
        return Icons.article;
      case 'comment':
        return Icons.comment;
      case 'like':
        return Icons.thumb_up;
      case 'repost':
        return Icons.repeat;
      case 'report':
        return Icons.flag;
      default:
        return Icons.star;
    }
  }
}
