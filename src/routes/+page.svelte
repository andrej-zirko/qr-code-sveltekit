<script>
	import { onMount } from 'svelte';
	import VcqrCode from './VCQRCode.svelte';
	import { enhance } from '$app/forms';

	export let form;

	const vc = {
		'@context': ['https://www.w3.org/2018/credentials/v1', 'https://my.sample-birthcertificate.eu'],
		type: ['VerifiableCredential', 'BirthCertificate'],
		issuer: 'did:web:did.dev.udisp8.di-uisp-accenture.com:tenants:bdd-test-issuer',
		issuanceDate: '2024-04-10T11:48:27.528628Z',
		credentialSubject: {
			id: 'did:key:z6MkioQsxkXo9NCTHaFq1UAg9mfC5C1JCLCq8x88gwvjfRT7#z6MkioQsxkXo9NCTHaFq1UAg9mfC5C1JCLCq8x88gwvjfRT7',
			childsForename: 'MAsUibgdsDghfuUYMhudqLrLMRnSLiViefotKQGjMqahvDbhEH',
			childsSurname: 'BSOmflZFrNBehwdhIreBAkuuMPURAmYKRkoWUaRZQxrBJQIRKC',
			dateOfBirth: '1990-05-14',
			Parent1Forename: 'nBrcMQewOAWnCPiPwweGeNYtCVhNfYqGQZedWYuynfSCKuFeKE',
			Parent1Surname: 'heQocspwZVDUyMngVorPbtoCrjtzcCcdlvsPUmCQTMyHfLYcTS',
			Parent2Forename: 'GYmGUzDrOGiSolkqUTbvpCdpWIicOBnwEHXXfMuMXARWjLUXXd',
			Parent2Surname: 'mGOKTdfIuVsrNMUURzSlXGFqQiWoHPWBDLtkGeTxiRRVxzahtt'
		},
		proof: {
			type: 'Ed25519Signature2018',
			proofPurpose: 'assertionMethod',
			verificationMethod:
				'did:web:did.dev.udisp8.di-uisp-accenture.com:tenants:bdd-test-issuer#key-1',
			created: '2024-04-10T11:48:31.213836+00:00',
			jws: 'eyJhbGciOiAiRWREU0EiLCAiYjY0IjogZmFsc2UsICJjcml0IjogWyJiNjQiXX0..tDcz3RtmNirf71qDH_nbr9N5iu8c6hgLKMlxHWubHDAJKAp1YmWev9PllgEUXmi2fUaFDFbe4OKbyQnNxsZ4Dw'
		}
	};
	const minifiedVc = {
		ct: ['vcc', 'bcc'],
		tp: ['vc', 'bc'],
		is: 'did:web:did.dev.udisp8.di-uisp-accenture.com:tenants:bdd-test-issuer',
		id: '2024-04-10T11:48:27.528628Z',
		cs: {
			id: 'did:key:z6MkioQsxkXo9NCTHaFq1UAg9mfC5C1JCLCq8x88gwvjfRT7#z6MkioQsxkXo9NCTHaFq1UAg9mfC5C1JCLCq8x88gwvjfRT7',
			cf: 'MAsUibgdsDghfuUYMhudqLrLMRnSLiViefotKQGjMqahvDbhEH',
			cs: 'BSOmflZFrNBehwdhIreBAkuuMPURAmYKRkoWUaRZQxrBJQIRKC',
			db: '1990-05-14',
			p1f: 'nBrcMQewOAWnCPiPwweGeNYtCVhNfYqGQZedWYuynfSCKuFeKE',
			p1s: 'heQocspwZVDUyMngVorPbtoCrjtzcCcdlvsPUmCQTMyHfLYcTS',
			p2f: 'GYmGUzDrOGiSolkqUTbvpCdpWIicOBnwEHXXfMuMXARWjLUXXd',
			p2s: 'mGOKTdfIuVsrNMUURzSlXGFqQiWoHPWBDLtkGeTxiRRVxzahtt'
		},
		pf: {
			tp: 'ed',
			pp: 'am',
			vm: 'did:web:did.dev.udisp8.di-uisp-accenture.com:tenants:bdd-test-issuer#key-1',
			cd: '2024-04-10T11:48:31.213836+00:00',
			jws: 'eyJhbGciOiAiRWREU0EiLCAiYjY0IjogZmFsc2UsICJjcml0IjogWyJiNjQiXX0..tDcz3RtmNirf71qDH_nbr9N5iu8c6hgLKMlxHWubHDAJKAp1YmWev9PllgEUXmi2fUaFDFbe4OKbyQnNxsZ4Dw'
		}
	};

	let errorCorrectionLevel = 'M'; // Default error correction level

	let jsonInput = JSON.stringify({});

	let isValidJson = true; // Flag to track if the input is valid JSON

	// Function to validate the JSON input
	const validateJson = () => {
		try {
			JSON.parse(jsonInput);
			isValidJson = true;
		} catch (error) {
			isValidJson = false;
		}
	};

	$: if (jsonInput || errorCorrectionLevel) {
        form = null; // Reset form to null or its initial state
    }
	
	// Auto-format the JSON input on mount
	onMount(() => {
		jsonInput = JSON.stringify(JSON.parse(jsonInput), null, 2);
	});

	const prefillData = (data) => {
		form = null;

		jsonInput = JSON.stringify(data, null, 2);
		validateJson();
	};
</script>

<main>
	<h1>QR Code Size Tester</h1>
	<form
		method="POST"
		use:enhance={() => {
			return async ({ update }) => {
				await update({ reset: false });
			};
		}}
	>
		<div class="button-container">
			<button type="button" on:click={() => prefillData(vc)}>Prefill with VC</button>
			<button type="button" on:click={() => prefillData(minifiedVc)}>Prefill with Minified VC</button>
		</div>

		<textarea
			name="jsonInput"
			rows="20"
			cols="100"
			bind:value={jsonInput}
			on:input={validateJson}
		/>
		<p class:error={!isValidJson}>
			{isValidJson ? 'Valid JSON' : 'Invalid JSON'}
		</p>

		<div class="dropdown-container">
			<label for="errorCorrectionLevel">Error Correction Level:</label>
			<select id="errorCorrectionLevel" bind:value={errorCorrectionLevel}>
				<option value="L">Low (L) ~7%</option>
				<option value="M">Medium (M) ~15%</option>
				<option value="Q">Quartile (Q) ~25%</option>
				<option value="H">High (H) ~30%</option>
			</select>
		</div>
		<div class="button-container">
			<button type="submit">Issue Credential</button>
		</div>
	</form>

	{#if form?.compressedVcQR}
		<VcqrCode
			data={form.compressedVcQR.data}
			token={form.compressedVcQR.token}
			errorMessage={form.compressedVcQR.errorMessage}
			label="Compressed token"
		/>
	{/if}

	{#if form?.compressedRatio}
		<div><p>The compression ration is {form.compressedRatio}</p></div>
	{/if}

	{#if form?.vcQR}
		<VcqrCode
			data={form.vcQR.data}
			token={form.vcQR.token}
			errorMessage={form.vcQR.errorMessage}
			label="Original token"
		/>
	{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	h2 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 2em;
		font-weight: 100;
	}

	.button-container {
		/* Added */
		margin-bottom: 1rem; /* Added */
	}

	.dropdown-container {
		margin: 1rem 0;
	}

	.error {
		color: red;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
