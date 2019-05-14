import { getGeneratedTestCase } from '@/api/code-generator.api';
import { useFetcher } from '@/hooks/useFetcher';
import React, { useEffect, useState } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/clike/clike';
import 'codemirror/theme/idea.css';
import './CodeDetails.scss';

interface Params {
    lang: string;
    testCaseId: string;
}

const CodeDetails: React.FunctionComponent<Params> = ({ lang, testCaseId }) => {
    const [code, setCode] = useState('\n'.repeat(30));
    useEffect(() => {
        const fetchData = async () => {
            const result = await getGeneratedTestCase(testCaseId, lang);
            setCode(result);
        };
        fetchData();
    }, [code]);
    return (
        <CodeMirror
            value={code}
            options={{
                mode: 'text/x-java',
                lineNumbers: true,
            }}
        />
    );
};

export default CodeDetails;
