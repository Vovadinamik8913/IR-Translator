import React from 'react';

const SVGpart = ({ title, svgContent }) => {
    const handleSvgClick = (event) => {
        const node = event.target.closest('.node');
        const edge = event.target.closest('.edge');

        if (node) {
            const blockTitle = node.querySelector('title')?.textContent || 'Без названия';
            console.log("Информация о блоке:", blockTitle); // Выводим информацию о блоке в консоль
        } else if (edge) {
            const blockFrom = edge.querySelector('title')?.textContent.split("->")[0] || 'NO NAME';
            console.log("Ребро из блока:", blockFrom);
            const blockTo = edge.querySelector('title')?.textContent.split('->')[1] || 'NO NAME';
            console.log("в блок:", blockTo);
        } else {
            console.log("Клик вне блоков и рёбер");
        }
    };

    return (
        <div className="window">
            <h2>{title}</h2>
            {svgContent ? (
                <div className="svg-win"
                    onClick={handleSvgClick}
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                     style={{cursor: "pointer"}}
                />
            ) : (
                <div className="svg-placeholder" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '300px',
                    border: '2px dashed #ccc',
                    color: '#888',
                    fontSize: '16px'
                }}>
                    SVG пока нет
                </div>
            )}
        </div>
    );
};

export default SVGpart;
