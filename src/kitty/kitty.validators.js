kitty.validators = {
	notEmpty: function (field) {
		return field.value.length > 0;
	},
	minLength: function(field, params) {
		return field.value.length > params.minLength;
	},
	numbersOnly: function (field) {
		var regex = /^\d+$|^$/;
		return regex.test(field.value);
	},
	only55CharactersMax: function (field) {
		return field.value.length < 56;
	},
	only250CharactersMax: function (field) {
		return field.value.length < 251;
	},
	moreThanZero: function (field) {
		return parseInt(field.value, 10) > 0;
	},
	startsWithZero: function (field) {
		var regex = /^0|^$/;
		return regex.test(field.value);
	},
	containsElevenCharacters: function (field) {
		return (field.value.length == 11) || (field.value.length === 0);
	},
	containsAtLeastTenCharacters: function (field) {
		return (field.value.length >= 10) || (field.value.length === 0);
	},
	containsSixteenOrEighteenCharacters: function (field) {
		return (field.value.length == 16) || (field.value.length == 18) || (field.value.length === 0);
	},
	containsLessThan32Characters: function (field) {
		return (field.value.length < 32) || (field.value.length === 0);
	},
	containsLessThan21Characters: function (field) {
		return (field.value.length < 21) || (field.value.length === 0);
	},
	startsWithZeroSeven: function (field) {
		var regex = /^07|^$/;
		return regex.test(field.value);
	},
	startsWithZeroAndANumberMoreThanZero: function (field) {
		var regex = /^0[1-9]|^$/;
		return regex.test(field.value);
	},
	mandatoryPhoneNumber: function (field) {
		return (
			this.notEmpty(field) &&
			this.startsWithZeroAndANumberMoreThanZero(field) &&
			this.containsAtLeastTenCharacters(field) &&
			this.numbersOnly(field)
			);
	},
	mobileNumber: function (field) {
		return (
			this.numbersOnly(field) &&
			this.containsElevenCharacters(field) &&
			this.startsWithZeroSeven(field)
			);
	},
	postCode: function (field) {
		var regex = /^([A-PR-UWYZa-pr-uwyz]([0-9]{1,2}|([A-HK-Ya-hk-y][0-9]|[0-9][A-HK-Ya-hk-y]|[A-HK-Ya-hk-y][0-9]([0-9]|[ABEHMNPRV-Yabehmnprv-y]))|[0-9][A-HJKS-UWa-hjks-uw])\ {0,1}[0-9][ABD-HJLNP-UW-Zabd-hjlnp-uw-z]{2}|([Gg][Ii][Rr]\ 0[Aa][Aa])|([Ss][Aa][Nn]\ {0,1}[Tt][Aa]1)|([Bb][Ff][Pp][Oo]\ {0,1}([Cc]\/[Oo]\ )?[0-9]{1,4})|(([Aa][Ss][Cc][Nn]|[Bb][Bb][Nn][Dd]|[BFSbfs][Ii][Qq][Qq]|[Pp][Cc][Rr][Nn]|[Ss][Tt][Hh][Ll]|[Tt][Dd][Cc][Uu]|[Tt][Kk][Cc][Aa])\ {0,1}1[Zz][Zz])|GIR0AA)$/;
		return regex.test(field.value);
	},
	cardName: function (field) {
		var regex = /^[A-Za-z `\-â€˜,\.&amp;'â€™\â€“]{4,40}$/;
		return (this.notEmpty(field) && regex.test(field.value));
	},
	cardNumber: function (field) {
		var regex = /^(\d{6}[\s-]?\d{12})$|^(\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{3})$|^(\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4})$|^3[4,7]\d{13}|[\*]{12}\d{4}$|^(\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{3})$|^(?:5[0678]\d\d|6304|6390|67\d\d)\d{8,15}$/;
		return regex.test(field.value);
	},
	securityCode: function (field) {
		var regex = /^[0-9]{3}$|^[0-9]{4}$/;
		return regex.test(field.value);
	}
};