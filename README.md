# agar-lvlgen

Agar-LvLGeN is a standalone implementation to farm XP at agar.

###### How-To:
1. Get your Facebook-Cookies, and put them into the config.
2. Edit the config
3. Run Start.bat (on windows) or run it through a terminal

## Config
###### How to edit your config:
When you have your cookies, replace them in the config to make it farm for your account.
Aditionally, you can specify the status delay and the regions.

When you first downloaded the lvlgen, your config should look something like this:
```
module.exports = {
	// Required
	c_user: "<c_user>",
	datr: "<datr>",
	xs: "<xs>",
	
	name: "EATER OF POTATO",
	
	// Advanced
	regions: ["BR-Brazil", "CN-China", "EU-London", "JP-Tokyo", "RU-Russia", "SG-Singapore", "TK-Turkey", "US-Atlanta"],
	statusDelay: 1000
}
```

## Cookies
###### How to get your Facebook token:
1. Get this extension: http://www.editthiscookie.com/
2. Go to facebook.com, click on the cookie and copy the values of datr and so on.

## License
[MIT](/LICENSE.md)
