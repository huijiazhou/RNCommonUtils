import {
    Dimensions,
    Platform,
    NativeModules,
    DeviceInfo
} from 'react-native';
/*
IOS devices resolutions
设备	            屏幕尺寸	分辨率（pt）	Reader	分辨率（px）	渲染后	    PPI
iPhone 3GS	    3.5吋	320x480	    @1x	    320x480	 	            163
iPhone 4/4s	    3.5吋	320x480 	@2x	    640x960	 	            330
iPhone 5/5s/5c	4.0吋	320x568 	@2x	    640x1136	 	        326
iPhone 6	    4.7吋	375x667 	@2x	    750x1334	 	        326
iPhone 6Plus	5.5吋	414x736	    @3x	    1242x2208	1080x1920	401
iPhone 6s	    4.7吋	375x667	    @2x	    750x1334	 	        326
iPhone 6sPlus	5.5吋	414x736	    @3x	    1242x2208	1080x1920	401
iPhone 7	    4.7吋	375x667	    @2x	    750x1334	 	        326
iPhone 7Plus	5.5吋	414x736	    @3x	    1242x2208	1080x1920	401
iPhone X                375x812
 */

const X_WIDTH = 375;
const X_HEIGHT = 812;

const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');

const { PlatformConstants = {} } = NativeModules;
const { minor = 0 } = PlatformConstants.reactNativeVersion || {};

module.exports = {
    isIphoneX: function(){
        if (Platform.OS === 'web') return false;
        if (minor >= 50) {
            return DeviceInfo.isIPhoneX_deprecated;
        }
        return (
            Platform.OS === 'ios' &&
            ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
                (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT))
        );
    },
    getOffset: function() {
        if (Platform.OS != 'ios') {

            switch (Dimensions.get('window').height) {
                case 480:
                    return 0;
                case 592:
                    return 44;
                default:
                    return 64;
            }
        }
        switch (Dimensions.get('window').height) {
            case 480://3GS/4/4s
                return 6;
            case 568://5/5s/5c/SE
                return 62;
            case 667://6/6s/7/8
                return 62;
            case 736://6sPlus/7Plus
                return 64;
            case 812://IphoneX
                return 86;
            default:
                return 0;
        }
    }

};

