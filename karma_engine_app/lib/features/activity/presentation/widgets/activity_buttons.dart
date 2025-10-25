import 'package:flutter/material.dart';
import 'package:karma_engine_app/core/utils/constants.dart';

class ActivityButtons extends StatelessWidget {
  const ActivityButtons({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Perform Activity',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        
        // Activity buttons grid
        GridView.count(
          crossAxisCount: 3,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          children: [
            _buildActivityButton(
              context,
              icon: Icons.edit,
              label: 'Post',
              type: Constants.activityPost,
            ),
            _buildActivityButton(
              context,
              icon: Icons.comment,
              label: 'Comment',
              type: Constants.activityComment,
            ),
            _buildActivityButton(
              context,
              icon: Icons.thumb_up,
              label: 'Like',
              type: Constants.activityLike,
            ),
            _buildActivityButton(
              context,
              icon: Icons.repeat,
              label: 'Repost',
              type: Constants.activityRepost,
            ),
            _buildActivityButton(
              context,
              icon: Icons.flag,
              label: 'Report',
              type: Constants.activityReport,
              isNegative: true,
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildActivityButton(
    BuildContext context, {
    required IconData icon,
    required String label,
    required String type,
    bool isNegative = false,
  }) {
    return ElevatedButton(
      onPressed: () {
        // Show dialog or navigate to activity creation screen
        _showActivityDialog(context, type, label);
      },
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.all(16),
        backgroundColor: isNegative 
            ? Colors.red.withOpacity(0.1) 
            : Theme.of(context).primaryColor.withOpacity(0.1),
        foregroundColor: isNegative ? Colors.red : Theme.of(context).primaryColor,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 32),
          const SizedBox(height: 8),
          Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  void _showActivityDialog(BuildContext context, String type, String label) {
    final TextEditingController controller = TextEditingController();
    
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Create $label'),
          content: TextField(
            controller: controller,
            decoration: InputDecoration(
              hintText: 'Enter your $label content...',
              border: const OutlineInputBorder(),
            ),
            maxLines: 3,
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                // In a real app, this would call the API to record the activity
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('$label recorded successfully!'),
                    backgroundColor: Colors.green,
                  ),
                );
              },
              child: const Text('Submit'),
            ),
          ],
        );
      },
    );
  }
}