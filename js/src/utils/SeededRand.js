export default class SeededRand {

    constructor(seed=123456789)
    {
        this.m_w = seed;
        this.m_z = 987654321;
        this.mask = 0xffffffff;
    }

    // Returns number between 0 (inclusive) and 1.0 (exclusive),
    // just like Math.random().
    random()
    {
        this.m_z = (36969 * (this.m_z & 65535) + (this.m_z >> 16)) & this.mask;
        this.m_w = (18000 * (this.m_w & 65535) + (this.m_w >> 16)) & this.mask;
        let result = ((this.m_z << 16) + this.m_w) & this.mask;
        result /= 4294967296;
        return result + 0.5;
    }
}
