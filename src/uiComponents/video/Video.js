import React, {useCallback, useEffect, useRef, useState} from 'react';
import Styles from './Video.style';
import { TouchableOpacity, View, ActivityIndicator } from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import { AntDesign } from '@react-native-vector-icons/ant-design';
import { Octicons } from '@react-native-vector-icons/octicons';
import {themes} from "../../theme/colors";

const Video = (props) => {

    const videoRef = useRef(null);

    const [isLoading, updateIsLoading] = useState(true);
    const [isBuffering, updateIsBuffering] = useState(true);
    const [isPaused, updateIsPaused] = useState(true);
    const [isMuted, updateIsMuted] = useState(true);
    const [volume, updateVolume] = useState(0);

    const {videoWrapper, disableTimer = true,
        disableFullscreen = true,
        disableVolume = true,
        disablePlayPause = true,
        disableSeekbar = true,
        disableBack = true,
        disableSeek = true,
        showOnStart = false,
        repeat = false,
    } = props;

    const togglePlayOrPause = () => {
        updateIsPaused(!isPaused)
    };

    const toggleMute = () => {
        // if(videoRef) {
        //     console.log('videoRef?.current', videoRef?.current?.state)
        //     // videoRef?.current?.state?.muted = !isMuted
        // }
        // updateVolume(volume === 0 ? 1 : 0)
        // updateIsMuted(!isMuted);
        // if (isMuted === true) {
        //     updateIsMuted(false);
        //     updateVolume(1.0);
        // } else {
        //     updateIsMuted(true);
        //     updateVolume(0.0);
        // }
    };

    const renderPlayButton = () => {
        return !isBuffering && !isLoading && isPaused ? <TouchableOpacity style={Styles.playButton}
                                             onPress={() => togglePlayOrPause()}>
           <AntDesign name='playcircleo' style={Styles.playButtonIcon} />
       </TouchableOpacity>  : null
    };

    const renderMuteButton = () => {
        return !isBuffering && !isLoading && !isPaused ? (
            <TouchableOpacity
                style={Styles.muteButton}
                activeOpacity={1} onPress={() => toggleMute()}>
                    <Octicons name={isMuted ? 'mute' : 'unmute'}
                              style={Styles.muteButtonIcon} />

            </TouchableOpacity>
        ) : null
    };

    console.log('videoRef', videoRef?.current)

    useEffect(() => {
        return () => {
            updateIsPaused(true)
        }
    }, [])

    return (
        <View style={[Styles.videoWrapper, videoWrapper]}>

            {isBuffering || isLoading ? <View style={Styles.bufferingView}>
                <ActivityIndicator color={themes['light'].colors.primary} size={'large'}/>
            </View> : null}

            <VideoPlayer
                style={{...props?.style}}
                ref={videoRef}
                resizeMode="cover"
                playInBackground={false}
                controls={false}
                showPoster={true}
                repeat={repeat}
                // muted={isMuted}
                // volume={volume}
                paused={isPaused}
                // showDuration={false}
                tapAnywhereToPause={true}
                disableSeek={disableSeek}
                hideControlsOnStart={true}
                showOnStart={showOnStart}
                onEnd={() => {
                    updateIsPaused(false)
                }}
                onPause={() => {
                    updateIsPaused(true)
                }}
                onPlay={() => {
                    updateIsPaused(false)
                }}
                onBuffer={(res) => {
                    updateIsBuffering(res?.isBuffering);
                }}
                onLoadStart={(res) => {
                    updateIsLoading(true);
                }}
                onLoad={(res) => {
                    updateIsLoading(false);
                }}
                disableBack={disableBack}
                disableTimer={disableTimer}
                disableVolume={disableVolume}
                disablePlayPause={disablePlayPause}
                disableSeekbar={disableSeekbar}
                disableFullscreen={disableFullscreen}
                {...props}
            />

               {renderPlayButton()}
               {/*{renderMuteButton()}*/}

        </View>
    );
};

export default Video;
