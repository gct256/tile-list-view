import * as React from 'react';

declare class TileListView extends React.Component<TileListView.Props> {}

declare namespace TileListView {
  interface Props {
    items: React.ReactNode[];
    itemWidth: number;
    itemHeight: number;
    selection: number[];

    style?: CSS.Properties<string | number>;
    className?: string;
    focusedStyle?: CSS.Properties<string | number>;
    focusedClassName?: string;

    onUpdateSelection?: (selection: number[]) => void;
    onUpdateCursor?: (cursor: number) => void;
    onUpdatePivot?: (pivot: number) => void;
    onKeyDown?: (event: KeyboardEvent) => void;
  }
}

export = TileListView;
