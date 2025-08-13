// "use client";

// import { useState, useEffect, useRef } from "react";
// import { getComments, submitComment } from "@/lib/wordpress";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import {
//   MessageCircle,
//   Reply,
//   Send,
//   CheckCircle,
//   AlertCircle,
//   Clock,
// } from "lucide-react";
// import { gsap } from "gsap";

// export default function CommentsSection({ postId, initialCount = 0 }) {
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [replyTo, setReplyTo] = useState(null);
//   const [totalComments, setTotalComments] = useState(initialCount);
//   const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'pending', or 'error'

//   const [formData, setFormData] = useState({
//     author: "",
//     email: "",
//     content: "",
//   });

//   const commentsRef = useRef(null);
//   const formRef = useRef(null);

//   useEffect(() => {
//     loadComments();
//   }, [postId]);

//   useEffect(() => {
//     // Animate comments on load
//     if (comments.length > 0 && commentsRef.current) {
//       gsap.fromTo(
//         commentsRef.current.children,
//         { opacity: 0, y: 30 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.6,
//           stagger: 0.1,
//           ease: "power2.out",
//         }
//       );
//     }
//   }, [comments]);

//   useEffect(() => {
//     // Animate form when it appears
//     if (showForm && formRef.current) {
//       gsap.fromTo(
//         formRef.current,
//         { opacity: 0, height: 0 },
//         {
//           opacity: 1,
//           height: "auto",
//           duration: 0.4,
//           ease: "power2.out",
//         }
//       );
//     }
//   }, [showForm]);

//   const loadComments = async () => {
//     try {
//       const data = await getComments(postId);
//       setComments(data.comments);
//       setTotalComments(data.totalComments);
//     } catch (error) {
//       console.error("Error loading comments:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.author || !formData.email || !formData.content) return;

//     setSubmitting(true);
//     setSubmitStatus(null);

//     try {
//       const newComment = await submitComment({
//         postId,
//         author: formData.author,
//         email: formData.email,
//         content: formData.content,
//         parent: replyTo?.id || 0,
//       });

//       if (
//         newComment.isPending ||
//         newComment.status === "hold" ||
//         newComment.status === "pending"
//       ) {
//         setSubmitStatus("pending");
//       } else {
//         setSubmitStatus("success");
//         // Only add to UI if comment is approved
//         if (replyTo) {
//           setComments((prev) =>
//             prev.map((comment) =>
//               comment.id === replyTo.id
//                 ? { ...comment, replies: [...comment.replies, newComment] }
//                 : comment
//             )
//           );
//         } else {
//           setComments((prev) => [newComment, ...prev]);
//         }
//         setTotalComments((prev) => prev + 1);
//       }

//       // Reset form
//       setFormData({ author: "", email: "", content: "" });
//       setShowForm(false);
//       setReplyTo(null);

//       // Animate success message
//       setTimeout(() => {
//         if (submitStatus === "success") {
//           const newCommentEl = commentsRef.current?.firstChild;
//           if (newCommentEl) {
//             gsap.fromTo(
//               newCommentEl,
//               { opacity: 0, scale: 0.9, y: -20 },
//               {
//                 opacity: 1,
//                 scale: 1,
//                 y: 0,
//                 duration: 0.5,
//                 ease: "back.out(1.7)",
//               }
//             );
//           }
//         }
//       }, 100);

//       setTimeout(() => setSubmitStatus(null), 8000);
//     } catch (error) {
//       console.error("Error submitting comment:", error);
//       setSubmitStatus("error");

//       if (error.message.includes("authentication")) {
//         setSubmitStatus("auth_error");
//       } else if (error.message.includes("permission")) {
//         setSubmitStatus("permission_error");
//       } else if (error.message.includes("duplicate")) {
//         setSubmitStatus("duplicate_error");
//       } else {
//         setSubmitStatus("error");
//       }

//       setTimeout(() => setSubmitStatus(null), 8000);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const CommentItem = ({ comment, isReply = false }) => (
//     <Card
//       className={`${
//         isReply ? "ml-8 mt-4" : "mb-6"
//       } hover:shadow-md transition-all duration-300`}
//     >
//       <CardHeader className="pb-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <img
//               src={comment.author.avatar || "/placeholder.svg"}
//               alt={comment.author.name}
//               className="w-10 h-10 rounded-full"
//             />
//             <div>
//               <h4 className="font-medium text-gray-900">
//                 {comment.author.name}
//               </h4>
//               <p className="text-sm text-gray-500">
//                 {formatDate(comment.date)}
//               </p>
//               {(comment.isPending ||
//                 comment.status === "pending" ||
//                 comment.status === "hold") && (
//                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 mt-1">
//                   <Clock className="h-3 w-3 mr-1" />
//                   Awaiting Approval
//                 </span>
//               )}
//             </div>
//           </div>

//           {!isReply && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => {
//                 setReplyTo(comment);
//                 setShowForm(true);
//               }}
//               className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
//             >
//               <Reply className="h-4 w-4 mr-1" />
//               Reply
//             </Button>
//           )}
//         </div>
//       </CardHeader>

//       <CardContent>
//         <div
//           className="text-gray-700 leading-relaxed"
//           dangerouslySetInnerHTML={{ __html: comment.content }}
//         />

//         {comment.replies && comment.replies.length > 0 && (
//           <div className="mt-4">
//             {comment.replies.map((reply) => (
//               <CommentItem key={reply.id} comment={reply} isReply={true} />
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );

//   if (loading) {
//     return (
//       <section className="mt-12">
//         <div className="flex items-center space-x-2 mb-6">
//           <MessageCircle className="h-6 w-6 text-blue-600" />
//           <h3 className="text-2xl font-bold text-gray-900">Comments</h3>
//         </div>
//         <div className="text-center py-8">Loading comments...</div>
//       </section>
//     );
//   }

//   return (
//     <section className="mt-12">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center space-x-2">
//           <MessageCircle className="h-6 w-6 text-blue-600" />
//           <h3 className="text-2xl font-bold text-gray-900">
//             Comments ({totalComments})
//           </h3>
//         </div>

//         <Button
//           onClick={() => setShowForm(!showForm)}
//           className="bg-blue-600 hover:bg-blue-700 transition-colors"
//         >
//           <MessageCircle className="h-4 w-4 mr-2" />
//           Add Comment
//         </Button>
//       </div>

//       {submitStatus && (
//         <Card
//           className={`mb-6 border-l-4 ${
//             submitStatus === "success"
//               ? "border-green-500 bg-green-50"
//               : submitStatus === "pending"
//               ? "border-yellow-500 bg-yellow-50"
//               : "border-red-500 bg-red-50"
//           }`}
//         >
//           <CardContent className="pt-4">
//             <div className="flex items-center space-x-2">
//               {submitStatus === "success" && (
//                 <CheckCircle className="h-5 w-5 text-green-600" />
//               )}
//               {submitStatus === "pending" && (
//                 <Clock className="h-5 w-5 text-yellow-600" />
//               )}
//               {(submitStatus === "error" || submitStatus.includes("error")) && (
//                 <AlertCircle className="h-5 w-5 text-red-600" />
//               )}
//               <div>
//                 <p
//                   className={`font-medium ${
//                     submitStatus === "success"
//                       ? "text-green-800"
//                       : submitStatus === "pending"
//                       ? "text-yellow-800"
//                       : "text-red-800"
//                   }`}
//                 >
//                   {submitStatus === "success" &&
//                     "Comment published successfully!"}
//                   {submitStatus === "pending" &&
//                     "Comment submitted for review!"}
//                   {submitStatus === "auth_error" && "Authentication Required"}
//                   {submitStatus === "permission_error" && "Permission Denied"}
//                   {submitStatus === "duplicate_error" && "Duplicate Comment"}
//                   {submitStatus === "error" && "Submission Failed"}
//                 </p>
//                 <p
//                   className={`text-sm mt-1 ${
//                     submitStatus === "success"
//                       ? "text-green-700"
//                       : submitStatus === "pending"
//                       ? "text-yellow-700"
//                       : "text-red-700"
//                   }`}
//                 >
//                   {submitStatus === "success" &&
//                     "Your comment is now visible to all readers."}
//                   {submitStatus === "pending" &&
//                     "Your comment will appear after admin approval."}
//                   {submitStatus === "auth_error" &&
//                     "Please check WordPress comment settings or enable guest comments."}
//                   {submitStatus === "permission_error" &&
//                     "Comments may be disabled for this post."}
//                   {submitStatus === "duplicate_error" &&
//                     "This comment has already been submitted."}
//                   {submitStatus === "error" &&
//                     "Please try again or contact support if the problem persists."}
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Comment Form */}
//       {showForm && (
//         <Card className="mb-8" ref={formRef}>
//           <CardHeader>
//             <h4 className="font-semibold">
//               {replyTo ? `Reply to ${replyTo.author.name}` : "Leave a Comment"}
//             </h4>
//             <p className="text-sm text-gray-600">
//               Your comment will be reviewed by an admin before being published.
//             </p>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input
//                   placeholder="Your Name"
//                   value={formData.author}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, author: e.target.value }))
//                   }
//                   required
//                 />
//                 <Input
//                   type="email"
//                   placeholder="Your Email (not published)"
//                   value={formData.email}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, email: e.target.value }))
//                   }
//                   required
//                 />
//               </div>

//               <Textarea
//                 placeholder="Write your comment..."
//                 value={formData.content}
//                 onChange={(e) =>
//                   setFormData((prev) => ({ ...prev, content: e.target.value }))
//                 }
//                 rows={4}
//                 required
//               />

//               <div className="flex justify-end space-x-2">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => {
//                     setShowForm(false);
//                     setReplyTo(null);
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   disabled={submitting}
//                   className="bg-blue-600 hover:bg-blue-700"
//                 >
//                   {submitting ? (
//                     "Submitting..."
//                   ) : (
//                     <>
//                       <Send className="h-4 w-4 mr-2" />
//                       Submit for Review
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       )}

//       {/* Comments List */}
//       <div ref={commentsRef}>
//         {comments.length > 0 ? (
//           comments.map((comment) => (
//             <CommentItem key={comment.id} comment={comment} />
//           ))
//         ) : (
//           <Card className="text-center py-12">
//             <CardContent>
//               <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <h4 className="text-lg font-medium text-gray-900 mb-2">
//                 No comments yet
//               </h4>
//               <p className="text-gray-600 mb-4">
//                 Be the first to share your thoughts!
//               </p>
//               <Button
//                 onClick={() => setShowForm(true)}
//                 className="bg-blue-600 hover:bg-blue-700"
//               >
//                 Start the Discussion
//               </Button>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </section>
//   );
// }

export default function CommentsSection() {
  return null;
}
