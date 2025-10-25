import { useState, useEffect } from 'react';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import useAuthStore from '@/store/useAuthStore';

// Custom hook for GitHub OAuth authentication
export function useGithubAuth() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const signInWithGithub = useAuthStore((state) => state.signInWithGithub);


    const discovery = {
        authorizationEndpoint: 'https://github.com/login/oauth/authorize',
        tokenEndpoint: 'https://github.com/login/oauth/access_token',
        revocationEndpoint: `https://github.com/settings/connections/applications/${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}`,
    };

    // Use expo-auth-session hooks
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID!,
            scopes: ['read:user', 'user:email', 'user:follow'],
            redirectUri: makeRedirectUri({
                scheme: 'expense-tracker',
            }),
        },
        discovery
    );

    useEffect(() => {
        // Check if the authentication response is ready
        if (response?.type === 'success') {
            const handleResponse = async (response: any) => {
                try {
                    setIsLoading(true);
                    const { code } = response.params;

                    const { access_token } = await createTokenWithCode(code, request?.codeVerifier);

                    if (!access_token) {
                        throw new Error('Failed to obtain access token');
                    }

                    await signInWithGithub(access_token)

                } catch (err: any) {
                    setError(err.message || 'An error occurred during authentication');
                } finally {
                    setIsLoading(false);
                }
            };
            handleResponse(response)
        }
    }, [response,request?.codeVerifier,signInWithGithub]);



    const createTokenWithCode = async (code: string, code_verifier?: string) => {
        const url =
            `https://github.com/login/oauth/access_token` +
            `?client_id=${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}` +
            `&client_secret=${process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET}` +
            `&code_verifier=${code_verifier}` +
            `&code=${code}`;

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            const errorDetails = await res.json();
            throw new Error(`GitHub OAuth Error: ${errorDetails.error_description}`);
        }

        const jsonResponse = await res.json();
        return jsonResponse;
    };

    // Return the authentication state, including user, loading, error, and promptAsync function
    return {
        error,
        isLoading,
        promptAsync, // Can be used to trigger the authentication flow
    };
}
