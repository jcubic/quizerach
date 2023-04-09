type PullDownT = {
    title: string;
    open?: boolean;
    children: React.ReactNode;
};

export default function PullDown({ children, title, open }: PullDownT) {
    return (
        <details style={{width: '100%'}} open={open}>
          <summary>{title}</summary>
          {children}
        </details>
    );
};
