import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressBar } from 'primereact/progressbar';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Header from '../common/Header';
import Footer from '../common/Footer';

interface User {
  name: string;
  avatar: string;
}

interface Post {
  id: number;
  user: User;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  videoUrl?: string;
  isPublic?: boolean;
}

interface Comment {
  id: number;
  user: User;
  text: string;
  timestamp: string;
  isEditing?: boolean;
}

interface SharePlatform {
  name: string;
  icon: string;
  url: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_CAPTION_LENGTH = 250;

const sharePlatforms: SharePlatform[] = [
  { name: 'Facebook', icon: 'pi pi-facebook', url: 'https://www.facebook.com/sharer/sharer.php?u=' },
  { name: 'Instagram', icon: 'pi pi-instagram', url: 'https://www.instagram.com/?url=' },
  { name: 'WhatsApp', icon: 'pi pi-whatsapp', url: 'https://wa.me/?text=' },
  { name: 'WeChat', icon: 'pi pi-wechat', url: 'https://weixin.qq.com/cgi-bin/redirectforward?args=' },
  { name: 'Email', icon: 'pi pi-envelope', url: 'mailto:?subject=Check%20out%20this%20video&body=' },
  { name: 'Twitter', icon: 'pi pi-twitter', url: 'https://twitter.com/intent/tweet?url=' },
  { name: 'Telegram', icon: 'pi pi-telegram', url: 'https://t.me/share/url?url=' },
  { name: 'LinkedIn', icon: 'pi pi-linkedin', url: 'https://www.linkedin.com/shareArticle?url=' },
];

const Social: React.FC = () => {
  const [showReelDialog, setShowReelDialog] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showComments, setShowComments] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [editCommentText, setEditCommentText] = useState('');
  const [activePostComments, setActivePostComments] = useState<Comment[]>([]);
  const toastRef = useRef<any>(null);
  const commentMenuRef = useRef<any>(null);

  // Custom toast options to ensure the close button works properly
  const customToastOptions = {
    closeOnEscape: true,
    closeOnClick: false,
    className: 'custom-toast',
    position: 'top-right' as const
  };

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      user: {
        name: 'Aisyah',
        avatar: ''
      },
      content: 'Just completed our first FamilyQuest! We had so much fun exploring Kampong Lorong Buangkok and learning about the local flora and fauna. Can\'t wait for our next adventure!',
      likes: 25,
      comments: 12,
      timestamp: '2 hours ago',
      isPublic: true,
    },
    {
      id: 2,
      user: {
        name: 'Amir',
        avatar: ''
      },
      content: 'Looking for a family-friendly activity this weekend? Anyone have recommendations for nature walks or parks with educational activities for kids?',
      likes: 8,
      comments: 5,
      timestamp: '4 hours ago',
      isPublic: true,
    },
    {
      id: 3,
      user: {
        name: 'Adib',
        avatar: ''
      },
      content: 'Check out our family adventure at East Coast Park!',
      likes: 42,
      comments: 15,
      timestamp: '1 day ago',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      isPublic: true,
    },
  ]);

  // Current logged-in user
  const currentUser = {
    name: 'Adib',
    avatar: ''
  };

  // Simulate comments for a post
  useEffect(() => {
    if (showComments !== null) {
      const simulatedComments: Comment[] = [
        {
          id: 1,
          user: { name: 'Zainab', avatar: '' },
          text: 'This looks amazing! Where exactly in East Coast Park was this?',
          timestamp: '2 hours ago'
        },
        {
          id: 2,
          user: { name: 'Hakim', avatar: '' },
          text: 'My kids would love this activity. Thanks for sharing!',
          timestamp: '5 hours ago'
        }
      ];
      setActivePostComments(simulatedComments);
    }
  }, [showComments]);

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        if (toastRef.current) {
          toastRef.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Video size exceeds 10MB limit',
            life: 3000,
            closable: true
          });
        }
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('video/')) {
        if (toastRef.current) {
          toastRef.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Please select a valid video file',
            life: 3000,
            closable: true
          });
        }
        return;
      }
      
      setSelectedVideo(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
    }
  };

  const handleReelUpload = () => {
    if (selectedVideo && caption.trim()) {
      // Simulate upload progress
      setIsUploading(true);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // Simulate content moderation check
          setTimeout(() => {
            const passesModeration = true;
            
            if (passesModeration) {
              const newPost: Post = {
                id: Date.now(),
                user: currentUser,
                content: caption,
                likes: 0,
                comments: 0,
                timestamp: 'Just now',
                videoUrl: videoPreviewUrl || undefined,
                isPublic: isPublic,
              };
              
              setPosts([newPost, ...posts]);
              
              setCaption('');
              setSelectedVideo(null);
              if (videoPreviewUrl) {
                URL.revokeObjectURL(videoPreviewUrl);
              }
              setVideoPreviewUrl(null);
              setIsPublic(true);
              setIsUploading(false);
              setUploadProgress(0);
              setShowReelDialog(false);
              
              if (toastRef.current) {
                toastRef.current.show({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Your reel has been posted!',
                  life: 3000,
                  closable: true
                });
              }
            } else {
              setIsUploading(false);
              if (toastRef.current) {
                toastRef.current.show({
                  severity: 'error',
                  summary: 'Content Moderation',
                  detail: 'Your video contains inappropriate content and cannot be posted.',
                  life: 5000,
                  closable: true
                });
              }
            }
          }, 1500);
        }
      }, 300);
    }
  };

  const handleAddComment = (postId: number) => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now(),
        user: currentUser,
        text: commentText,
        timestamp: 'Just now',
      };
      
      setActivePostComments([...activePostComments, newComment]);
      
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return { ...post, comments: post.comments + 1 };
        }
        return post;
      }));
      
      setCommentText('');
    }
  };

  const startEditComment = (commentId: number) => {
    setActivePostComments(activePostComments.map(comment => {
      if (comment.id === commentId) {
        setEditCommentText(comment.text);
        return { ...comment, isEditing: true };
      }
      return { ...comment, isEditing: false };
    }));
  };

  const cancelEditComment = () => {
    setActivePostComments(activePostComments.map(comment => {
      return { ...comment, isEditing: false };
    }));
    setEditCommentText('');
  };

  const saveEditComment = (commentId: number) => {
    if (editCommentText.trim()) {
      setActivePostComments(activePostComments.map(comment => {
        if (comment.id === commentId) {
          return { 
            ...comment, 
            text: editCommentText,
            isEditing: false,
            timestamp: 'Just now (edited)'
          };
        }
        return comment;
      }));
      setEditCommentText('');
      
      if (toastRef.current) {
        toastRef.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Comment updated successfully',
          life: 2000,
          closable: true
        });
      }
    }
  };

  const confirmDeleteComment = (commentId: number) => {
    confirmDialog({
      message: 'Are you sure you want to delete this comment?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => deleteComment(commentId),
    });
  };

  const deleteComment = (commentId: number) => {
    setActivePostComments(activePostComments.filter(comment => comment.id !== commentId));
    
    // Update comment count in the post if showComments is not null
    if (showComments !== null) {
      setPosts(posts.map(post => {
        if (post.id === showComments) {
          return { ...post, comments: post.comments - 1 };
        }
        return post;
      }));
    }
    
    if (toastRef.current) {
      toastRef.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Comment deleted successfully',
        life: 2000,
        closable: true
      });
    }
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  const handleShare = (postId: number) => {
    const postToShare = posts.find(post => post.id === postId);
    
    if (!postToShare) return;

    // Only allow sharing if the post belongs to the current user
    if (postToShare.user.name !== currentUser.name) {
      if (toastRef.current) {
        toastRef.current.show({
          severity: 'warn',
          summary: 'Cannot Share',
          detail: 'You can only share your own posts',
          life: 3000,
          closable: true
        });
      }
      return;
    }

    if (toastRef.current) {
      const closeShareDialog = () => {
        if (toastRef.current) {
          toastRef.current.close();
        }
      };

      toastRef.current.show({
        severity: 'info',
        summary: 'Share',
        detail: 'Choose where to share:',
        life: 0, // Keep open until closed
        closable: true, // Enable default close button
        onDismiss: closeShareDialog,
        onHide: closeShareDialog,
        content: (
          <div className="flex flex-col gap-4 relative p-0">
            {/* <div className="absolute top-0 right-0 p-2">
              <Button
                icon="pi pi-times"
                className="p-button-rounded p-button-text p-button-sm p-button-secondary text-gray-500 bg-gray-100 hover:bg-gray-200"
                onClick={closeShareDialog}
                aria-label="Close"
                style={{ fontSize: '1.2rem', width: '2rem', height: '2rem' }}
                tabIndex={0}
              />
            </div> */}
            <div className="flex flex-col gap-2 mt-4 w-fit mx-auto">
              {sharePlatforms.map(platform => (
                <Button
                  key={platform.name}
                  icon={platform.icon}
                  label={platform.name}
                  className="p-button-outlined p-button-secondary text-gray-500 bg-gray-100 hover:bg-gray-200"
                  onClick={() => {
                    if (toastRef.current) {
                      toastRef.current.show({
                        severity: 'info',
                        summary: 'Sharing',
                        detail: `Sharing on ${platform.name}...`,
                        life: 2000,
                        closable: true
                      });
                      closeShareDialog();
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )
      });
    }
  };

  // Clean up video preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <Toast ref={toastRef} {...customToastOptions} />
      <ConfirmDialog />
      <Header />
      
      <main className="flex-1 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">Reels</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card 
              key={post.id}
              className="shadow-lg p-4 bg-white rounded-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <Avatar 
                  icon="pi pi-user"
                  className="w-10 h-10 bg-gray-200 text-gray-600"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{post.user.name}</h3>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">{post.timestamp}</span>
                    {post.isPublic ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Public</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">Private</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-gray-700 mb-4">{post.content}</div>
              
              {post.videoUrl && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <video 
                    src={post.videoUrl} 
                    controls 
                    className="w-full h-auto max-h-80 object-cover"
                    preload="metadata"
                  />
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Button 
                    icon="pi pi-heart" 
                    className="p-button-text p-button-secondary text-gray-500 bg-gray-100 hover:bg-gray-200"
                    onClick={() => handleLike(post.id)}
                  >
                    {post.likes}
                  </Button>
                  <Button 
                    icon="pi pi-comment" 
                    className="p-button-text p-button-secondary text-gray-500 bg-gray-100 hover:bg-gray-200"
                    onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                  >
                    {post.comments}
                  </Button>
                  {post.user.name === currentUser.name && (
                    <Button 
                      icon="pi pi-share-alt" 
                      className="p-button-text p-button-secondary text-gray-500 bg-gray-100 hover:bg-gray-200"
                      onClick={() => handleShare(post.id)}
                      tooltip="Share this post"
                      tooltipOptions={{ position: 'top' }}
                    />
                  )}
                </div>
              </div>
              
              {showComments === post.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium mb-2">Comments</h4>
                  <div className="space-y-3 mb-3">
                    {activePostComments.map(comment => (
                      <div key={comment.id} className="flex gap-2 group">
                        <Avatar 
                          icon="pi pi-user"
                          className="w-8 h-8 bg-gray-200 text-gray-600"
                        />
                        <div className="flex-1">
                          {comment.isEditing ? (
                            <div className="flex flex-col gap-2">
                              <InputTextarea
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                rows={2}
                                autoFocus
                                className="w-full p-2 text-sm"
                              />
                              <div className="flex gap-2 justify-end">
                                <Button
                                  label="Cancel"
                                  className="p-button-text p-button-sm p-button-secondary text-gray-500 bg-gray-100 hover:bg-gray-200"
                                  onClick={cancelEditComment}
                                />
                                <Button
                                  label="Save"
                                  className="p-button-sm p-button-secondary text-gray-500 bg-gray-100 hover:bg-gray-200"
                                  onClick={() => saveEditComment(comment.id)}
                                  disabled={!editCommentText.trim()}
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="bg-gray-100 p-2 rounded-lg relative">
                                <span className="font-medium text-sm">{comment.user.name}</span>
                                <p className="text-sm">{comment.text}</p>
                                
                                {comment.user.name === currentUser.name && (
                                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      icon="pi pi-ellipsis-h"
                                      className="p-button-text p-button-rounded p-button-sm p-button-secondary text-gray-500 bg-gray-100 hover:bg-gray-200"
                                      onClick={(e) => {
                                        if (commentMenuRef.current) {
                                          commentMenuRef.current.toggle(e);
                                          // Store the current comment ID in a data attribute
                                          (e.currentTarget as HTMLElement).dataset.commentId = comment.id.toString();
                                        }
                                      }}
                                    />
                                    <Menu 
                                      ref={commentMenuRef} 
                                      popup 
                                      model={[
                                        {
                                          label: 'Edit',
                                          icon: 'pi pi-pencil',
                                          command: () => {
                                            const commentId = parseInt(
                                              document.querySelector('[data-comment-id]')?.getAttribute('data-comment-id') || '0'
                                            );
                                            startEditComment(commentId);
                                          }
                                        },
                                        {
                                          label: 'Delete',
                                          icon: 'pi pi-trash',
                                          className: 'p-button-danger',
                                          command: () => {
                                            const commentId = parseInt(
                                              document.querySelector('[data-comment-id]')?.getAttribute('data-comment-id') || '0'
                                            );
                                            confirmDeleteComment(commentId);
                                          }
                                        }
                                      ]}
                                    />
                                  </div>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">{comment.timestamp}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <InputText 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 p-2 text-sm"
                    />
                    <Button 
                      icon="pi pi-send"
                      className="p-button-text p-button-secondary text-gray-500 bg-gray-100 hover:bg-gray-200"
                      onClick={() => handleAddComment(post.id)}
                      disabled={!commentText.trim()}
                    />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Video Reel Dialog */}
        <Dialog
          header="Upload Video Reel"
          visible={showReelDialog}
          style={{ width: '50vw' }}
          onHide={() => {
            if (!isUploading) {
              setShowReelDialog(false);
              setSelectedVideo(null);
              if (videoPreviewUrl) {
                URL.revokeObjectURL(videoPreviewUrl);
              }
              setVideoPreviewUrl(null);
              setCaption('');
              setIsPublic(true);
              setUploadProgress(0);
            }
          }}
          className="p-fluid"
        >
          <div className="flex flex-col gap-4">
            {!videoPreviewUrl ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="hidden"
                  id="video-upload"
                />
                <label 
                  htmlFor="video-upload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <i className="pi pi-cloud-upload text-4xl text-gray-400 mb-2"></i>
                  <span className="text-gray-500 mb-1">Click to upload video (max 10MB)</span>
                  <span className="text-xs text-gray-400">MP4, MOV, or WebM formats</span>
                </label>
              </div>
            ) : (
              <div className="rounded-lg overflow-hidden mb-2 relative">
                <video 
                  src={videoPreviewUrl} 
                  controls 
                  className="w-full h-auto max-h-80 object-cover"
                />
                <Button
                  icon="pi pi-times"
                  className="p-button-rounded p-button-text p-button-sm p-button-secondary text-gray-500 bg-gray-100 hover:bg-gray-200"
                  onClick={() => {
                    if (videoPreviewUrl) {
                      URL.revokeObjectURL(videoPreviewUrl);
                    }
                    setSelectedVideo(null);
                    setVideoPreviewUrl(null);
                  }}
                  disabled={isUploading}
                />
              </div>
            )}
            
            <div>
              <label htmlFor="caption" className="block text-sm font-medium mb-2">
                Caption <span className="text-xs text-gray-500">({caption.length}/{MAX_CAPTION_LENGTH})</span>
              </label>
              <InputTextarea
                id="caption"
                value={caption}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CAPTION_LENGTH) {
                    setCaption(e.target.value);
                  }
                }}
                rows={3}
                className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200"
                placeholder="Add a caption to your video..."
                disabled={isUploading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Privacy</label>
              <div className="flex gap-4">
                <div className="flex items-center">
                  <RadioButton 
                    inputId="public" 
                    name="privacy" 
                    value={true} 
                    onChange={() => setIsPublic(true)} 
                    checked={isPublic}
                    disabled={isUploading}
                  />
                  <label htmlFor="public" className="ml-2 text-sm">Public</label>
                </div>
                <div className="flex items-center">
                  <RadioButton 
                    inputId="private" 
                    name="privacy" 
                    value={false} 
                    onChange={() => setIsPublic(false)} 
                    checked={!isPublic}
                    disabled={isUploading}
                  />
                  <label htmlFor="private" className="ml-2 text-sm">Private</label>
                </div>
              </div>
            </div>
            
            {isUploading && (
              <div>
                <label className="block text-sm font-medium mb-2">Upload Progress</label>
                <ProgressBar value={uploadProgress} />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                label="Cancel"
                className="p-button-outlined p-button-secondary text-gray-500 bg-gray-100 hover:bg-gray-200"
                onClick={() => {
                  if (!isUploading) {
                    setShowReelDialog(false);
                    setSelectedVideo(null);
                    if (videoPreviewUrl) {
                      URL.revokeObjectURL(videoPreviewUrl);
                    }
                    setVideoPreviewUrl(null);
                    setCaption('');
                    setIsPublic(true);
                  }
                }}
                disabled={isUploading}
              />
              <Button
                label={isUploading ? "Uploading..." : "Upload"}
                icon="pi pi-upload"
                className="p-button-secondary text-gray-500 bg-gray-100 hover:bg-gray-200"
                onClick={handleReelUpload}
                disabled={!selectedVideo || !caption.trim() || isUploading}
                loading={isUploading}
              />
            </div>
          </div>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default Social;
