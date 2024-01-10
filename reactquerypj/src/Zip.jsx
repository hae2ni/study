import { useEffect, useRef, useState } from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { data } from "./data";
import axios from "axios";
import { useMutation } from "react-query";

async function PutFuntion(blob) {
  const response = await axios.put(
    "https://nonsoolmate-server-bucket.s3.ap-northeast-2.amazonaws.com/exam-sheet/f297e380-99cd-4de6-ba04-408e13e853a5.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240110T163903Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Credential=AKIARVDDCS6TVUA2J2DO%2F20240110%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=c6258d8663fc6da980b80be73d9dfbdc759b7177b50f9d05b49e1805cac74269",
    blob,
    {
      headers: {
        Orgin: "http://localhost:5173/",
        "Content-Type": "binary/octet-stream",
      },
    }
  );
  return response.data;
}

export default function Zip() {
  const fileInput = useRef(null);
  const [isfile, setIsfile] = useState("");
  let zip = new JSZip();

  const { mutate, isError, error } = useMutation(PutFuntion, {
    onSuccess: () => {
      console.log("성공");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  if (isError) {
    return <p>{error.toString()}</p>;
  }

  function handleButtonClick() {
    console.log(isfile);
  }

  function handleDDDD(e) {
    const fileList = Array.from(e.target.files);
    setIsfile(fileList);
  }

  //   useEffect(() => {
  //     console.log(isfile);
  //   }, [isfile]);

  function handleZipButtonClick() {
    let files = Array.from(isfile); // FileList를 배열로 변환
    console.log("here");
    if (files.length) {
      files.forEach((file) => {
        // 각 파일을 바이너리 형식으로 읽기
        const reader = new FileReader();
        reader.onload = function (event) {
          // 파일을 zip에 추가
          zip.file(file.name, event.target.result, { binary: true });

          // 모든 파일이 처리되었는지 확인

          // ZIP 생성 및 로그 내용
          zip.generateAsync({ type: "blob" }).then((blob) => {
            console.log(blob); // ZIP 파일 blob 로그
            // saveAs(blob, "example.zip");
            mutate(blob);

            console.log("Blob type:", blob.type);
          });
        };
        reader.readAsBinaryString(file);
      });
    }
  }
  return (
    <>
      <button onClick={handleButtonClick}>파일 업로드</button>
      <input
        onChange={handleDDDD}
        ref={fileInput}
        type="file"
        multiple={true}
        id="fileUpload"
      />
      <button onClick={handleZipButtonClick}>파일 압축 확인</button>
    </>
  );
}
