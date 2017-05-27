class Tree {

    /**
     * @param {Object} data
     * @param {[Tree]} childrenTrees
     */
    constructor(data, childrenTrees) {
        this.parent = undefined;
        this.data = data;
        this.children = childrenTrees;
    }

    /**
     * @param tree
     */
    addChildTree(tree) {
        tree.parent = tree;
        this.children.push(tree)
    }

    /**
     * @param {Function} testFunction
     * @returns {[Object]}
     */
    bfSearchForNodes(testFunction) {
        const foundNodes = [];
        const queue = [];
        let currentNode;
        queue.push(this);

        while(queue.length != 0) {
            currentNode = queue.shift();

            if (testFunction(currentNode.data)) {
                foundNodes.push(currentNode);
            }

            queue.concat(currentNode.children);
        }

        return foundNodes;
    }

    /**
     * @param {Function} testFunction
     * @returns {Object}
     */
    bfSearchForSingleNode(testFunction) {
        const queue = [];
        let currentNode;
        queue.push(this);

        while(queue.length != 0) {
            currentNode = queue.shift();

            if (testFunction(currentNode.data)) {
                return currentNode;
            }

            queue.concat(currentNode.children);
        }
    }
}