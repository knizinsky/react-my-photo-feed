import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import styled from 'styled-components';
import { getUser } from '../services/supabaseService';
import { Post } from '../types/Post';
import { User } from '@supabase/supabase-js';

const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newCommentContent, setNewCommentContent] = useState<{ [postId: string]: string }>({});
  const [showAddPostButton, setShowAddPostButton] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(null);

  // Pobierz obecnego użytkownika
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getUser();
      setCurrentUser(user);
    };

    fetchCurrentUser();
  }, []);

  // Funkcja do pobierania postów z komentarzami
  const fetchPosts = async () => {
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*, user:users(username), comments:comments(*, user:users(username))');

    if (postsError) {
      console.error('Error fetching posts:', postsError);
    } else {
      setPosts(posts);
    }
  };

  // Pobierz posty przy pierwszym renderowaniu
  useEffect(() => {
    fetchPosts();
  }, []);

  // Dodaj nowy post
  const handleAddPost = async () => {
    const user = await getUser();

    if (!user) {
      alert('Musisz być zalogowany, aby dodać post.');
      return;
    }

    if (!newPostTitle || !newPostContent) {
      alert('Proszę wypełnić tytuł i treść posta.');
      return;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([{ title: newPostTitle, content: newPostContent, user_id: user.id }]);

    if (error) {
      console.error('Error adding post:', error);
    } else {
      // Po dodaniu posta, ponownie pobierz posty z bazy danych
      await fetchPosts();
      setNewPostTitle('');
      setNewPostContent('');
      setShowAddPostButton(false);
    }
  };

  // Usuń post
  const handleDeletePost = async (postId: string) => {
    const user = await getUser();

    if (!user) {
      alert('Musisz być zalogowany, aby usunąć post.');
      return;
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', user.id); // Tylko autor może usunąć post

    if (error) {
      console.error('Error deleting post:', error);
    } else {
      // Po usunięciu posta, ponownie pobierz posty z bazy danych
      await fetchPosts();
    }
  };

  // Dodaj komentarz do posta
  const handleAddComment = async (postId: string) => {
    const user = await getUser();

    if (!user) {
      alert('Musisz być zalogowany, aby dodać komentarz.');
      return;
    }

    const commentContent = newCommentContent[postId];
    if (!commentContent) {
      alert('Proszę wpisać treść komentarza.');
      return;
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: postId, user_id: user.id, content: commentContent }]);

    if (error) {
      console.error('Error adding comment:', error);
    } else {
      // Po dodaniu komentarza, ponownie pobierz posty z bazy danych
      await fetchPosts();
      setNewCommentContent({ ...newCommentContent, [postId]: '' });
    }
  };

  return (
    <Container>
      <h1>Posty</h1>

      {/* Formularz dodawania postów */}
      <AddPostSection>
        {!showAddPostButton ? (
          <button onClick={() => setShowAddPostButton(true)}>Dodaj post</button>
        ) : (
          <>
            <h2>Dodaj nowy post</h2>
            <input
              type="text"
              placeholder="Tytuł posta"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
            />
            <textarea
              placeholder="Treść posta"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            <button onClick={handleAddPost}>Dodaj post</button>
            <button onClick={() => setShowAddPostButton(false)}>Anuluj</button>
          </>
        )}
      </AddPostSection>

      {/* Lista postów */}
      <PostList>
        {posts.map((post) => (
          <PostCard key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p><strong>Autor:</strong> {post.user?.username}</p>

            {/* Przycisk usuwania posta (tylko dla autora) */}
            {currentUser && post.user_id === currentUser.id && (
              <button onClick={() => handleDeletePost(post.id)}>Usuń post</button>
            )}

            {/* Komentarze do posta */}
            <CommentsSection>
              <h3>Komentarze:</h3>
              {post.comments?.map(comment => (
                <CommentCard key={comment.id}>
                  <p><strong>{comment.user?.username}:</strong> {comment.content}</p>
                </CommentCard>
              ))}

              {/* Formularz dodawania komentarza */}
              <AddCommentSection>
                <textarea
                  placeholder="Dodaj komentarz"
                  value={newCommentContent[post.id] || ''}
                  onChange={(e) =>
                    setNewCommentContent({ ...newCommentContent, [post.id]: e.target.value })
                  }
                />
                <button onClick={() => handleAddComment(post.id)}>Dodaj komentarz</button>
              </AddCommentSection>
            </CommentsSection>
          </PostCard>
        ))}
      </PostList>
    </Container>
  );
};

export default PostsPage;

// Stylowanie
const Container = styled.div`
  padding: 20px;
`;

const AddPostSection = styled.div`
  margin-bottom: 20px;

  input, textarea {
    display: block;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    max-width: 500px;
  }

  textarea {
    height: 100px;
  }

  button {
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background: #0056b3;
  }
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PostCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: #f9f9f9;

  h2 {
    margin: 0 0 10px;
  }

  button {
    margin-top: 10px;
    padding: 5px 10px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background: #c82333;
  }
`;

const CommentsSection = styled.div`
  margin-top: 20px;
`;

const CommentCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
  background: white;
`;

const AddCommentSection = styled.div`
  margin-top: 10px;

  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  button {
    padding: 5px 10px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background: #218838;
  }
`;