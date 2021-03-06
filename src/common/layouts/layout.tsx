import { AuthMessage, LoadingOverlay, NavBar } from 'common/components';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import React, { useMemo } from 'react';

type LayoutProps = {
    children: React.ReactNode;
    loading?: boolean;
    title?: string;
};

export const Layout = ({ title, children, loading }: LayoutProps) => {
    const { data: session, status } = useSession();

    const isLoading = useMemo(
        () => loading || status === 'loading',
        [loading, status]
    );

    if (isLoading) {
        return <LoadingOverlay loading={isLoading} />;
    }

    return (
        <>
            <Head>
                <title> {title} </title>
            </Head>
            <main>
                <NavBar />
                {session ? children : <AuthMessage />}
            </main>
        </>
    );
};
