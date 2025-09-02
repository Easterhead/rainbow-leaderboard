const axios = require('axios');

/**
 * Parses text content to find the highest point value
 * @param {string} text - The text content to parse
 * @returns {object} Object containing the highest points found and whether points were found
 */
function parsePointsFromText(text) {
  if (!text) return { maxPoints: 0, pointsFound: false };
  
  let maxPoints = 0;
  let pointsFound = false;
  
  // A single regex pattern with three capturing groups for different point formats
  const pointsPattern = /\b(\d+(?:\.\d+)?)\s*(?:points?|pts?)\b|\b(?:final|total)(?:\s+points?)?(?:\s+for\b[^.\n:=]*)?(?:[^.\n]*?[:=]\s*)+(\d+(?:\.\d+)?)(?=[.\n]|$)|^\s*=\s*(\d+(?:\.\d+)?)\s*$/gim;
  
  // Match all instances of the pattern
  const matches = [...text.matchAll(pointsPattern)];
  
  // Extract the values from the appropriate capture groups
  const values = matches.map(match => {
    // Group 1: Points format (42 points, 42 pts)
    if (match[1]) return parseFloat(match[1]);
    // Group 2: Final/Total format
    if (match[2]) return parseFloat(match[2]);
    // Group 3: Standalone equals format
    if (match[3]) return parseFloat(match[3]);
    return 0;
  }).filter(value => !isNaN(value) && value > 0);
  
  if (values.length > 0) {
    pointsFound = true;
    maxPoints = Math.max(...values);
  }
  
  return { maxPoints, pointsFound };
}

/**
 * Processes comments to extract points
 * @param {Array} simplifiedComments - Array of simplified comment objects
 * @returns {Array} The same comments with points added
 */
function processCommentsForPoints(simplifiedComments) {
  return simplifiedComments.map(comment => {
    const { maxPoints, pointsFound } = parsePointsFromText(comment.text);
    
    return {
      ...comment,
      points: pointsFound ? maxPoints : 0,
      pointsFound
    };
  });
}

/**
 * Creates a leaderboard by finding max points for each unique user
 * @param {Array} commentsWithPoints - Array of comments with points
 * @returns {Array} Leaderboard array with unique users and their max points
 */
function createLeaderboard(commentsWithPoints) {
  // Map to store the highest points for each user
  const userPointsMap = new Map();
  
  // Process each comment to find highest points per user
  commentsWithPoints.forEach(comment => {
    const { name, avatar, points } = comment;
    
    // Skip if no name or no points
    if (!name) return;
    
    // Get current points for this user (or 0 if not found)
    const currentPoints = userPointsMap.get(name)?.points || 0;
    
    // Only update if the new points are higher
    if (points > currentPoints) {
      userPointsMap.set(name, { name, avatar, points });
    }
  });
  
  // Convert the map to an array and sort by points (highest first)
  return Array.from(userPointsMap.values())
    .sort((a, b) => b.points - a.points);
}

/**
 * Fetches all replies and returns a combined list of original comments and replies
 * @param {Array} comments - Array of original comment objects
 * @returns {Array} Combined array of original comments and their replies
 */
async function fetchAllRepliesAndReturnAllComments(comments) {
  let allComments = [...comments]; // Start with the original comments
  
  // Filter comments that have replies
  const commentsWithReplies = comments.filter(comment => comment.replyCount > 0);
  
  console.log(`Fetching replies for ${commentsWithReplies.length} comments...`);
  
  // For each comment with replies, fetch the replies
  for (const comment of commentsWithReplies) {
    try {
      // Skip if no commentId
      if (!comment.commentId) {
        console.log(`Skipping comment without commentId: ${comment.text.substring(0, 50)}...`);
        continue;
      }
      
      console.log(`Fetching replies for comment by ${comment.name} (${comment.replyCount} replies)`);
      
      const repliesUrl = `https://www.wattpad.com/v5/comments/namespaces/comments/resources/${comment.commentId}/comments`;
      const repliesResponse = await axios.get(repliesUrl);
      
      if (repliesResponse.data && repliesResponse.data.comments) {
        // Process each reply
        const replies = repliesResponse.data.comments.map(reply => {
          return {
            name: reply.user.name,
            avatar: reply.user.avatar,
            text: reply.text,
            replyCount: 0, // Replies to replies are not supported
            commentId: reply.commentId?.resourceId || '',
            isReply: true,
            parentComment: comment.commentId
          };
        });
        
        console.log(`Found ${replies.length} replies`);
        
        // Add the replies to our collection
        allComments = allComments.concat(replies);
      }
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`Error fetching replies for comment ${comment.commentId}:`, error.message);
      // Continue with the next comment even if this one fails
    }
  }
  
  console.log(`Total comments after fetching replies: ${allComments.length}`);
  return allComments;
}

async function fetchWattpadData() {
  const url = 'https://www.wattpad.com/v5/comments/namespaces/parts/resources/1564485447/comments?limit=1000';
  
  try {
    const response = await axios.get(url);
    
    // Extract the fields we want from each comment
    const simplifiedComments = response.data.comments.map(comment => {
      return {
        name: comment.user.name,
        avatar: comment.user.avatar,
        text: comment.text,
        replyCount: comment.replyCount || 0,
        commentId: comment.commentId?.resourceId || '' // Extract the resourceId from the commentId object
      };
    });
    
    // Fetch replies and get a combined list of all comments
    const allComments = await fetchAllRepliesAndReturnAllComments(simplifiedComments);
    
    // Process all comments (including replies) to extract points
    const allCommentsWithPoints = processCommentsForPoints(allComments);
    
    // Create leaderboard with max points per user
    const leaderboard = createLeaderboard(allCommentsWithPoints);
    
    // Log the leaderboard
    console.log('Leaderboard (Unique users with max points):');
    leaderboard.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}: ${user.points} points`);
    });
    
    return leaderboard;
  } catch (error) {
    console.error('Error:', error.message);
    return [];
  }
}

// Export the functions for testing and use in other files
module.exports = {
  parsePointsFromText,
  processCommentsForPoints,
  createLeaderboard,
  fetchAllRepliesAndReturnAllComments,
  fetchWattpadData
};

// Only run the fetch function if this file is executed directly
if (require.main === module) {
  fetchWattpadData();
}