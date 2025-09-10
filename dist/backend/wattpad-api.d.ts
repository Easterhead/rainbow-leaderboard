import { LeaderboardEntry, PointsResult } from '../types';
interface Comment {
    name: string;
    avatar: string;
    text: string;
    replyCount: number;
    commentId: string;
    isReply?: boolean;
    parentComment?: string;
}
interface CommentWithPoints extends Comment {
    points: number;
    pointsFound: boolean;
}
/**
 * Parses text content to find the highest point value
 * @param text - The text content to parse
 * @returns Object containing the highest points found and whether points were found
 */
declare function parsePointsFromText(text: string): PointsResult;
/**
 * Processes comments to extract points
 * @param simplifiedComments - Array of simplified comment objects
 * @returns The same comments with points added
 */
declare function processCommentsForPoints(simplifiedComments: Comment[]): CommentWithPoints[];
/**
 * Creates a leaderboard by finding max points for each unique user
 * @param commentsWithPoints - Array of comments with points
 * @returns Leaderboard array with unique users and their max points
 */
declare function createLeaderboard(commentsWithPoints: CommentWithPoints[]): LeaderboardEntry[];
/**
 * Fetches all replies and returns a combined list of original comments and replies
 * @param comments - Array of original comment objects
 * @returns Combined array of original comments and their replies
 */
declare function fetchAllRepliesAndReturnAllComments(comments: Comment[]): Promise<Comment[]>;
/**
 * Fetches leaderboard data from Wattpad API
 * @returns Array of users with their names and highest points,
 * sorted by points in descending order
 */
declare function fetchWattpadData(): Promise<LeaderboardEntry[]>;
export { parsePointsFromText, processCommentsForPoints, createLeaderboard, fetchAllRepliesAndReturnAllComments, fetchWattpadData };
