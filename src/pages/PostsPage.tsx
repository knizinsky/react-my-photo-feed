import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import styled from "styled-components";
import { getUser } from "../services/supabaseService";
import { Post } from "../types/Post";
import { User } from "@supabase/supabase-js";
import SubTitle from "../components/ui/SubTitle";
import Button, { ButtonSmall, PrimaryButton } from "../components/ui/Button";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextArea from "../components/ui/TextArea";
import Input from "../components/ui/Input";
import LoadingSpinner from "../components/LoadingSpinner";

const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newCommentContent, setNewCommentContent] = useState<{
    [postId: string]: string;
  }>({});
  const [showAddPostButton, setShowAddPostButton] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getUser();
      setCurrentUser(user);
    };

    fetchCurrentUser();
  }, []);

  const fetchPosts = async () => {
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select(
        "*, user:users(username), comments:comments(*, user:users(username))"
      );

    if (postsError) {
      console.error("Error fetching posts:", postsError);
    } else {
      setPosts(posts);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAddPost = async () => {
    const user = await getUser();

    if (!user) {
      alert("Musisz być zalogowany, aby dodać post.");
      return;
    }

    if (!newPostTitle || !newPostContent) {
      alert("Proszę wypełnić tytuł i treść posta.");
      return;
    }

    const { data, error } = await supabase
      .from("posts")
      .insert([
        { title: newPostTitle, content: newPostContent, user_id: user.id },
      ]);

    if (error) {
      console.error("Error adding post:", error);
    } else {
      await fetchPosts();
      setNewPostTitle("");
      setNewPostContent("");
      setShowAddPostButton(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const user = await getUser();

    if (!user) {
      alert("Musisz być zalogowany, aby usunąć post.");
      return;
    }

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting post:", error);
    } else {
      await fetchPosts();
    }
  };

  const handleAddComment = async (postId: string) => {
    const user = await getUser();

    if (!user) {
      alert("Musisz być zalogowany, aby dodać komentarz.");
      return;
    }

    const commentContent = newCommentContent[postId];
    if (!commentContent) {
      alert("Proszę wpisać treść komentarza.");
      return;
    }

    const { data, error } = await supabase
      .from("comments")
      .insert([{ post_id: postId, user_id: user.id, content: commentContent }]);

    if (error) {
      console.error("Error adding comment:", error);
    } else {
      await fetchPosts();
      setNewCommentContent({ ...newCommentContent, [postId]: "" });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container>
      <h1>Posty</h1>
      <SubTitle>
        Poniżej znajduje się lista wszystkich postów dodanych przez
        użytkowników. Mozesz dodawać nowe posty i komentarze.
      </SubTitle>

      <AddPostSection>
        {!showAddPostButton ? (
          <PrimaryButton onClick={() => setShowAddPostButton(true)}>
            Dodaj post
          </PrimaryButton>
        ) : (
          <>
            <AddNewPostHeader>Dodaj nowy post</AddNewPostHeader>
            <Input
              type="text"
              placeholder="Tytuł posta"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
            />
            <TextArea
              placeholder="Treść posta"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            <DecisionButtons>
              <PrimaryButton onClick={handleAddPost}>Dodaj post</PrimaryButton>
              <Button onClick={() => setShowAddPostButton(false)}>
                Anuluj
              </Button>
            </DecisionButtons>
          </>
        )}
      </AddPostSection>

      <PostList>
        {posts.map((post) => (
          <PostCard key={post.id}>
            <PostHeaderContainer>
              <PostTitle>{post.title}</PostTitle>
              <PostAuthor>{post.user?.username}</PostAuthor>
            </PostHeaderContainer>
            <PostContent>{post.content}</PostContent>

            {currentUser && post.user_id === currentUser.id && (
              <ButtonSmall onClick={() => handleDeletePost(post.id)}>
                <FontAwesomeIcon icon={faTrashCan} /> Usuń post
              </ButtonSmall>
            )}

            <CommentsSection>
              <CommentsHeader>Komentarze:</CommentsHeader>
              {post.comments?.map((comment) => (
                <CommentCard key={comment.id}>
                  <p>
                    <strong>{comment.user?.username}:</strong> {comment.content}
                  </p>
                </CommentCard>
              ))}

              <AddCommentSection>
                <TextArea
                  placeholder="Napisz komentarz..."
                  value={newCommentContent[post.id] || ""}
                  onChange={(e) =>
                    setNewCommentContent({
                      ...newCommentContent,
                      [post.id]: e.target.value,
                    })
                  }
                />
                <PrimaryButton onClick={() => handleAddComment(post.id)}>
                  Dodaj komentarz
                </PrimaryButton>
              </AddCommentSection>
            </CommentsSection>
          </PostCard>
        ))}
      </PostList>
    </Container>
  );
};

export default PostsPage;

const AddNewPostHeader = styled.div`
  font-size: 22px;
  color: #ffffffd1;
  font-weight: 600;
  text-align: center;
  margin-bottom: 12px;
`;

const DecisionButtons = styled.div`
  display: flex;
  gap: 12px;
  button {
    width: 100%;
    padding: 8px 15px;
  }
`;

const PostContent = styled.span`
  margin: 0px 30px 12px;
  color: #fffffff0;
  background: #93939354;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 0 10px #27272754;
  border: 1px solid #6e6e6e;
`;

const PostAuthor = styled.span`
  font-size: 15px;
  color: #ffffffb7;
  font-weight: 400;
  padding: 4px 0 15px;
`;

const PostTitle = styled.span`
  font-size: 22px;
  color: #ffffff;
  font-weight: 600;
`;

const PostHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px;
  font-size: 19px;
  color: #ffffffe0;
`;

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AddPostSection = styled.div`
  margin-bottom: 20px;
  width: 380px;
  text-align: center;

  input,
  textarea {
    display: block;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 4px;
    width: 100%;
    max-width: 500px;
  }

  textarea {
    height: 100px;
  }
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 70%;
`;

const PostCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #4040408c;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  background: #1d1d1d8f;
  box-shadow: 6px 8px 9px 3px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  color: #ffffff99;
  background-image: linear-gradient(309deg, #00000026, #ffffff12);
`;

const CommentsSection = styled.div`
  margin: 20px 30px;
  width: calc(100% - 60px);
`;
const CommentsHeader = styled.span`
  text-align: left;
  margin-bottom: 7px;
  display: block;
  font-weight: 500;
  color: #ffffffb5;
`;

const CommentCard = styled.div`
  border-radius: 4px;
  padding: 7px 12px;
  margin-bottom: 10px;
  background: linear-gradient(183deg, #ffffff, #dadada);
  display: flex;
  color: #313131;
  font-size: 15px;
  border: 1px solid #b7b7b7;
  box-shadow: 0 0 9px 7px #2626261c;
  text-align: left;
`;

const AddCommentSection = styled.div`
  display: flex;
  flex-direction: column;

  button {
    width: 200px;
    margin-top: 10px;
  }
`;
