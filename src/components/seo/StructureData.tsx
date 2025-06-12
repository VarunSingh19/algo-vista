
export default function StructuredData() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                '@id': 'https://vibearmor.com/#website',
                'url': 'https://vibearmor.com/',
                'name': 'VibeArmor',
                'description': 'Track your progress on algorithm problems with personalized sheets and statistics.',
                'potentialAction': [
                    {
                        '@type': 'SearchAction',
                        'target': {
                            '@type': 'EntryPoint',
                            'urlTemplate': 'https://vibearmor.com/search?q={search_term_string}'
                        },
                        'query-input': 'required name=search_term_string'
                    }
                ],
                'inLanguage': 'en-US'
            },
            {
                '@type': 'Organization',
                '@id': 'https://vibearmor.com/#organization',
                'name': 'VibeArmor',
                'url': 'https://vibearmor.com/',
                'logo': {
                    '@type': 'ImageObject',
                    'inLanguage': 'en-US',
                    '@id': 'https://vibearmor.com/#logo',
                    'url': 'https://vibearmor.com/logo.svg',
                    'contentUrl': 'https://vibearmor.com/logo.svg',
                    'width': 200,
                    'height': 200,
                    'caption': 'VibeArmor'
                },
                'image': {
                    '@id': 'https://vibearmor.com/#logo'
                }
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
