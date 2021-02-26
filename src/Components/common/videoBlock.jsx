import React from 'react';
import ReactPlayer from 'react-player';

const VideoBlock = ({ sec }) => {
  return (
    <div className='videoads'>
      <h1>This screen will disappear in {sec} seconds.</h1>
      <ReactPlayer
        playing={true}
        url='https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4'
        width='100%'
        height='100%'
      />
      {/* <ReactPlayer url='https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4' /> */}
    </div>
  );
};

export default VideoBlock;
