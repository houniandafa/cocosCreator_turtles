import { _decorator, Component, Node, Prefab, instantiate, Enum, tween, v2, v3, Tween, UITransform, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

const POS = Enum({
    TOP: 300,
    BOTTOM: -500
});

@ccclass('UImain')
export class UImain extends Component {
    @property(Prefab) public turtle: Prefab = null;
    @property(Node) public turtleManager: Node = null;

    // 指向当前使用乌龟
    public nowTurtle: Node = null;

    start() {
        this.nowTurtle = this.newTurtle();
    }

    private newTurtle(): Node {

        this.node.on(Node.EventType.TOUCH_END, this.downTurtle, this);

        let t: Node = instantiate(this.turtle);
        t.parent = this.turtleManager;
        t.setPosition(0, POS.TOP)

        tween(t).repeatForever(
            tween()
                .to(1, { scale: v3(0, 0) })
                .to(1, { scale: v3(1, 1) })
        ).start();
        return t;
    }

    private downTurtle(e: EventTouch): void {
        this.node.off(Node.EventType.TOUCH_END, this.downTurtle, this);
        Tween.stopAll()
        let count = this.turtleManager.children.length
        if (count === 1) {
            tween(this.nowTurtle)
                .to(0.5, { position: v3(0, POS.BOTTOM) }).start()
            // 1秒后继续
            this.scheduleOnce(() => {
                this.nowTurtle = this.newTurtle();
            }, 1);
        } else {
            // 寻找最底下的乌龟
            let index = count - 2;
            let bottomNode = this.turtleManager.children[index];
            // 求出位置
            let pos = bottomNode.position
            let _node = bottomNode.getComponent(UITransform)
            let posY = pos.y + _node.height * bottomNode.scale.y;
            tween(this.nowTurtle)
                .to(0.5, { position: v3(0, posY) }).start()
            // 比较缩放度
            if (this.nowTurtle.scale.x > bottomNode.scale.x) {
                console.log('游戏失败');
            } else {
                // 是否成功到6
                if (count === 6) {
                    console.log('游戏成功');
                    return;
                }
                // 1秒后继续
                this.scheduleOnce(() => {
                    this.nowTurtle = this.newTurtle();
                }, 1);
            }
        }
    }

}

