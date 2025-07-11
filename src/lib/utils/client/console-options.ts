const inputOptions = new Map<string, () => void>([
	['ethan cantor', () => window.open('https://escantor.com', '_blank')],
	['hamburger', () => window.open('https://www.google.com/search?udm=2&q=hamburger', '_blank')],
	['sandwich', () => window.open('https://www.youtube.com/watch?v=mIFRG1-6_y0', '_blank')],
	['eec', () => window.open('https://eternalesports.club/test_feature_v3', '_blank')],
	['eternal esports club', () => window.open('https://www.samhsa.gov/mental-health/988', '_blank')]
]);

export function onSubmit(input: string, updateInput: (newInput: string) => void): void {
	if (input === 'quake') {
		updateInput(quake);
		return;
	} else if (input === 'help') {
		updateInput(help);
		return;
	}

	const command = inputOptions.get(input);
	if (command) {
		command();
	}
}

const quake = `float Q_rsqrt( float number )
{
    long i;
    float x2, y;
    const float threehalfs = 1.5F;

    x2 = number * 0.5F;
    y  = number;
    i  = * ( long * ) &y;                       // evil floating point bit level hacking
    i  = 0x5f3759df - ( i >> 1 );               // what the fuck?
    y  = * ( float * ) &i;
    y  = y * ( threehalfs - ( x2 * y * y ) );   // 1st iteration
//    y  = y * ( threehalfs - ( x2 * y * y ) );   // 2nd iteration, this can be removed

    return y;
}`;

const help = `ethan cantor | hamburger | sandwich | quake | eec | eternal esports club`;
