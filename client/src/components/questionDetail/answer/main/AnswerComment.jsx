import React, { useState } from "react";
import { styled } from "styled-components";
import useForm from "../../../../hooks/useForm";
import getWriteDate from "../../../utils/getWriteDate";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { IoTrash } from "react-icons/io5";
import { useAuthContext } from "../../../../context/AuthContext";
import useAxiosData from "../../../../hooks/useAxiosData";

// questionComment 코드 중복 로직이 많음

const StyleAnswerComment = styled.div`
  font-size: 13px;
  padding-top: 10px;
  width: 1000px;
  margin-left: auto;
  line-height: 15px;
  .comentlist {
    border-top: 1px solid var(--border);
    padding: 10px;
    flex-wrap: wrap;
    > span {
      padding-right: 5px;
    }
  }
  .writecomment {
    border-top: 1px solid var(--border);
    padding: 15px;
    width: 100%;
    &::placeholder {
      color: var(--black-200);
    }
  }
  .username {
    color: var(--blue-600);
    cursor: pointer;
    &:hover {
      color: var(--blue-500);
      font-weight: 600;
    }
  }
  .createdat {
    color: var(--black-400);
  }
  .showMoreButton {
    border-top: 1px solid var(--border);
    color: var(--blue-600);
    padding: 10px;
    cursor: pointer;
    &:hover {
      color: var(--blue-500);
    }
    > span {
      font-weight: 700;
    }
  }
  .icon {
    font-size: 16px;
    color: var(--black-400);
    margin-left: 2px;
    margin-bottom: -3px;
    &:hover {
      color: var(--black-600);
    }
  }
  .editcomment {
    margin-left: 15px;
    border: 1.8px dashed var(--black-400);
    border-radius: 5px;
    width: 300px;
    padding-left: 5px;
    &::placeholder {
      text-align: center;
    }
  }
`;

export default function AnswerComment({ data, answer_id }) {
  // 상태 변수 추가
  const [showAllComments, setShowAllComments] = useState(false);

  // 댓글 수정 관련 상태
  const [showEditInput, setShowEditInput] = useState(false);
  const [editId, setEditId] = useState("");

  let { user } = useAuthContext();
  if (!user) {
    user = { userId: "0" };
  }

  const navigate = useNavigate();
  const axiosData = useAxiosData();

  // 댓글을 더 보여주기 위한 함수
  const handleShowMoreComments = () => {
    setShowAllComments(true);
  };

  // input창 (댓글) 작성 부분
  const initialInputData = {
    comment: "",
  };
  const [inputData, onInputChangeHandler, clearForm] =
    useForm(initialInputData);

  // 댓글 edit 부분
  const [editInput, onEditInputChangeHandler, _] = useForm(initialInputData);

  const handleEnterKeyPress = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      try {
        const url = "answer-comments"; //

        const requestData = {
          userId: user.userId,
          answer_id: answer_id,
          answerComment_content: inputData.comment,
        };

        const responseData = await axiosData("post", url, requestData);

        console.log("Post successful:", responseData);
      } catch (error) {
        console.error("Error posting:", error);
      }

      console.log("Form submitted:", inputData.comment);
      clearForm();
      navigate(0);
    }
  };

  // 댓글 수정 로직
  const handleEdit = async (answerComment_id) => {
    // 폼 제출시 로직을 구현해야함(완료) **** 작성자 유저id 추가로 넘겨줘야함
    setShowEditInput(!showEditInput);
    setEditId(answerComment_id);
  };
  // 댓글 수정 로직2
  const handleEditSubmit = async (e, answerComment_id) => {
    if (e.key === "Enter") {
      e.preventDefault();

      try {
        const url = `answer-comments/${answerComment_id}`; // Assuming the endpoint is handled in the axiosData function

        const requestData = {
          userId: user.userId,
          answer_id: answer_id,
          answerComment_content: editInput.comment,
        };

        const responseData = await axiosData("patch", url, requestData);

        console.log("Post successful:", responseData);
      } catch (error) {
        console.error("Error posting:", error);
      }

      navigate(0);
    }
  };
  const handleDelete = async (answerComment_id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (shouldDelete) {
      try {
        const url = `answer-comments/${answerComment_id}`;

        const responseData = await axiosData("delete", url);

        console.log("Delete successful:", responseData);
      } catch (error) {
        console.error("Error posting:", error);
      }

      navigate(0);
    }
  };

  const postData = data.answerCommentList;

  return (
    <StyleAnswerComment>
      {postData.map(
        (data, idx) =>
          // 5개까지만 표시
          ((!showAllComments && idx < 5) || showAllComments) && (
            <div key={idx} className="comentlist">
              <span className="commentbody">
                {data.answerComment_content} -
              </span>
              <span
                className="username"
                onClick={() => navigate(`/users/${data.userId}`)}
              >
                {data.displayName}
              </span>
              <span className="createdat">
                {getWriteDate(data.answerComment_createdAt)}
              </span>
              {user.userId.toString() === data.userId.toString() && (
                <>
                  <MdEdit
                    className="icon"
                    onClick={() => handleEdit(data.answerComment_id)}
                  />
                  <IoTrash
                    className="icon"
                    onClick={() => handleDelete(data.answerComment_id)}
                  />
                </>
              )}
              {showEditInput && editId === data.answerComment_id ? (
                <input
                  type="text"
                  name="comment"
                  value={editInput.comment}
                  onChange={(e) => onEditInputChangeHandler(e)}
                  onKeyDown={(e) => handleEditSubmit(e, data.answerComment_id)}
                  placeholder="Edit your comment ➡ Enter"
                  className="editcomment"
                ></input>
              ) : null}
            </div>
          )
      )}
      {/* 5개 이상일경우 Show ~ more comments 렌더링 */}
      {postData.length > 5 && !showAllComments && (
        <div className="showMoreButton" onClick={handleShowMoreComments}>
          Show <span>{postData.length - 5}</span> more comments
        </div>
      )}

      {user.userId !== "0" && (
        <input
          type="text"
          name="comment"
          value={inputData.comment}
          onChange={(e) => onInputChangeHandler(e)}
          onKeyDown={handleEnterKeyPress}
          placeholder="Add a comment"
          className="writecomment"
        />
      )}
    </StyleAnswerComment>
  );
}
