import {StyleSheet} from 'react-native';
import {themes} from "../../theme/colors";
// import Theme from '';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  view: {
    backgroundColor: 'transparent',
    width: '100%',
  },
  viewContainer: {
    backgroundColor: themes['light'].colors.tertiary,
    padding: 30,
    width: '100%',
    borderRadius: 32,
  },
  popupHeaderButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    padding: 5
  },
  popupHeaderButtonIcon: {
    fontSize: 20,
    color: themes['light'].colors.gray8,
  },
  popupHeader: {
    alignItems: 'center',
    position: 'relative',
    zIndex: 1
  },
  popupHeaderImage: {
    width: 150,
    height: 38
  },
  circleView: {
    marginTop: 25,
    marginBottom: 20,
    width: 42,
    height: 42,
    borderRadius: 42 ,
    backgroundColor: themes['light'].colors.primary,
    shadowColor: themes['light'].colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  circleViewIcon: {
    color: themes['light'].colors.tertiary,
    fontSize: 20
  },
  title: {
    fontSize: 18,
    color: themes['light'].colors.primary,
    fontFamily: themes.font.bold,
    fontWeight: '700',
    marginBottom: 5
  },
  subTitle: {
    fontSize: 14,
    color: themes['light'].colors.primaryLight,
    fontFamily: themes.font.regular,
    marginBottom: 20
  },
  amountTitle: {
    fontSize: 16,
    color: themes['light'].colors.dark,
    fontFamily: themes.font.bold,
    fontWeight: '700',
    marginBottom: 5
  },
  amountText: {
    fontSize: 20,
    color: themes['light'].colors.primary,
    fontFamily: themes.font.bold,
    fontWeight: '700',
    marginBottom: 10
  },
  list: {
    marginTop: 15
  },
  listHeader: {
    marginBottom: 15
  },
  listHeaderText: {
    fontSize: 16,
    color: themes['light'].colors.dark,
    fontFamily: themes.font.bold,
    fontWeight: '700',
    textAlign: 'left'
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 10
  },
  listItemText: {
    flex: 1,
    marginRight: 10,
    fontSize: 12,
    color: themes['light'].colors.primaryLight,
    fontFamily: themes.font.regular,
    textAlign: 'left'
  },
  listItemLastText: {
    flex: 0,
    marginRight: 0
  },
  popupFooter: {
  },

  animationContainer: {
    marginBottom: 15
  },
  animation: {

  },

  vectorImage: {
    width: 122.76,
    height: 111.42,
    marginVertical: 40
  },
  vectorImageNormal: {
    width: 122.76,
    height: 111.42,
    marginBottom: 30
  },
  popupTitle: {
    fontSize: 16,
    color: themes['light'].colors.primary,
    fontFamily: themes.font.bold,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20
  },
  popupText: {
    fontSize: 14,
    color: themes['light'].colors.gray4,
    fontFamily: themes.font.regular,
    textAlign: 'center',
    lineHeight: 20,
    marginVertical: 20
  },
  popupSubText: {
    fontSize: 14,
    color: themes['light'].colors.gray4,
    fontFamily: themes.font.medium,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 0,
    marginBottom: 20
  },
  buttonContainer: {
    flexDirection: 'column',
    marginHorizontal: -15,
    marginTop: 20
  },
  buttonStyle: {
    marginHorizontal: 15,
    marginBottom: 5
  }
});
