
const Loader = () => {
    return (
      <div className="loader-container">
        <div className="loader">
          <div className="ring ring-1"></div>
          <div className="ring ring-2"></div>
          <div className="ring ring-3"></div>
          <div className="text">Loading...</div>
        </div>
  
        {/* Embedded CSS */}
        <style>{`
          /* Fullscreen Background */
          .loader-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000;
            display: flex;
            justify-content: center;
            align-items: center;
          }
  
          /* Loader Wrapper */
          .loader {
            position: relative;
            width: 200px;
            height: 200px;
            perspective: 1000px;
          }
  
          /* Rotating Neon Rings */
          .loader .ring {
            position: absolute;
            width: 200px;
            height: 200px;
            border-radius: 50%;
            border:0px solid #011015
            
          }
  
          .loader .ring-1 {
            border-bottom-width: 8px;
            border-color: rgb(255, 0, 255);
            animation: rotate1 2s linear infinite;
          }

          .loader .ring-2 {
            border-right-width: 8px;
            border-color: rgb(0, 247, 255);
            animation: rotate2 2s linear infinite;
          }
  
          .loader .ring-3 {
            border-top-width: 8px;
            border-color: rgb(0, 255, 13);
            animation: rotate3 2s linear infinite;
          }
  
          /* Loading Text */
          .loader .text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #ffffff;
            font-size: 18px;
            font-weight: bold;
            font-family: sans-serif;
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
          }
  
          /* Rotation Animations */
          @keyframes rotate1 {
            0% {
              transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
            }
            100% {
              transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
            }
          }
  
          @keyframes rotate2 {
            0% {
              transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
            }
            100% {
              transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
            }
          }
  
          @keyframes rotate3 {
            0% {
              transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
            }
            100% {
              transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
            }
          }
        `}</style>
      </div>
    );
  };
  
  export default Loader;
  
  