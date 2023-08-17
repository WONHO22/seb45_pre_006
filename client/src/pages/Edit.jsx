import React from "react";
import { styled } from "styled-components";
import EditContainer from "../components/edit/EditContainer";
import { useLocation } from "react-router-dom";

const StyleEdit = styled.div`
  width: var(--inner);
  padding: 40px 24px 24px 24px;
`;

export default function Edit() {
  const location = useLocation();

  // 데이터 받기, 답변 데이터는 어떻게 포현해줘야할지 고민해야함 (질문과, 답변 공통으로 쓰이기 때문)
  // 해결 어려우면 질문용 edit, 답변용 edit 만들어야할듯
  const post = location.state.posts[0];

  return (
    <StyleEdit>
      {console.log(post)}
      <EditContainer post={post}></EditContainer>
    </StyleEdit>
  );
}
