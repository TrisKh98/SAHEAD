
const Project = require('../models/Project');
const Hopphan = require('../models/Hopphan');
const Tags = require('../models/Tags');
const Ourteam = require('../models/Ourteam');
const Partner = require('../models/Partner');
const Type = require('../models/Type');
const Statis =require('../models/Statistics')
const Room = require('../models/Room');
const Events = require('../models/Events');
const Equiment = require('../models/Equiment');

const { mutipleMongooseToObject } = require('../../util/mongoose');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

class StatisticsController{

    view(req, res, next) {
          Statis.find({})
            .then((Statis) => {
              res.render('admin/statis/view', { Statis: mutipleMongooseToObject(Statis) });
            })
            .catch(next);
        }
      // [POST]/Statis/store
    store(req, res, next) {
        // don_vi, chi_so,
        // Lấy dữ liệu JSON từ request
        let { vi_en_json } = req.body;
        const vi_en = vi_en_json ? JSON.parse(vi_en_json) : { vi: {}, en: {} };
        const { nam, hoat_dong, gia_tri } = req.body;
  
        const data = {
          vi_en: {
            vi: {
              chi_so: vi_en.vi?.chi_so || '',
              don_vi: vi_en.vi?.don_vi || '',
            },
            en: {
              chi_so: vi_en.en?.chi_so || '',
              don_vi: vi_en.en?.don_vi || '',
            },
          },
          nam: nam,
          // don_vi: don_vi,
          // chi_so:
          //   mode === 'event'
          //     ? 'Sự kiện'
          //     : chi_so === 'all'
          //     ? 'Người tham gia'
          //     : chi_so,
          gia_tri: gia_tri,
          hoat_dong: hoat_dong,
        };
      
        Statis.create(data)
          .then(() => {
            res.redirect('back');
          })
          .catch(error => {
            next(error);
          });
      }
      // [GET]/Statis/:id/edit
      edit(req, res, next) {
        Statis.findById(req.params.id)
          .lean()
          .then((Statis) => res.render('admin/statis/edit', { Statis }))
          .catch(next);
      }
      // [PUT]/Statis/:id
      // update(req, res, next) {
      //   // res.json(req.body)
      //   Statis.findById(req.params.id)
      //     .then((statis) => {
      //       if (!statis) {
      //         return res.status(404).json({ message: 'Không tìm thấy statis' });
      //       }
    
      //       // Kiểm tra và lấy dữ liệu JSON từ request body
      //       let { vi_en_json } = req.body;
      //       const vi_en = vi_en_json ? JSON.parse(vi_en_json) : { vi: {}, en: {} };
    
      //       // Chuẩn bị dữ liệu để cập nhật vào database
      //       const updateData = {
      //         vi_en: {
      //           vi: {
      //             chi_so: vi_en.vi?.chi_so?.trim() || statis.vi_en.vi?.chi_so,
      //             don_vi: vi_en.vi?.don_vi?.trim() || statis.vi_en.vi?.don_vi,
      //           },
      //           en: {
      //             chi_so: vi_en.en?.chi_so?.trim() || statis.vi_en.en?.chi_so,
      //             don_vi: vi_en.en?.don_vi?.trim() || statis.vi_en.en?.don_vi,
      //           },
      //         },
      //         nam: nam,
      //         // don_vi: don_vi,
      //         // chi_so:
      //         //   mode === 'event'
      //         //     ? 'Sự kiện'
      //         //     : chi_so === 'all'
      //         //     ? 'Người tham gia'
      //         //     : chi_so,
      //         gia_tri: gia_tri,
      //         hoat_dong: hoat_dong,
      //       };
    
      //       // Cập nhật dữ liệu vào database
      //       return Statis.updateOne({ _id: req.params.id }, updateData);
      //     })
      //     .then(() => {
      //       res.json({ message: 'Cập nhật thành công' });
      //       // res.redirect('/statis/view');
      //     })
      //     .catch((error) => {
      //       console.error('Lỗi khi cập nhật statis:', error);
      //       res.status(500).json({ message: 'Lỗi khi cập nhật statis', error });
      //     });
      // }

      update(req, res, next) {
        Statis.findById(req.params.id)
          .then((statis) => {
            if (!statis) {
              return res.status(404).json({ message: 'Không tìm thấy statis' });
            }
      
            let { vi_en_json, nam, hoat_dong, gia_tri } = req.body;
      
            if (typeof vi_en_json === 'string') {
              vi_en_json = JSON.parse(vi_en_json);
            }
      
            const vi_en = vi_en_json || { vi: {}, en: {} };
      
            const updateData = {
              vi_en: {
                vi: {
                  chi_so: vi_en.vi?.chi_so?.trim() || statis.vi_en.vi?.chi_so,
                  don_vi: vi_en.vi?.don_vi?.trim() || statis.vi_en.vi?.don_vi,
                },
                en: {
                  chi_so: vi_en.en?.chi_so?.trim() || statis.vi_en.en?.chi_so,
                  don_vi: vi_en.en?.don_vi?.trim() || statis.vi_en.en?.don_vi,
                },
              },
              nam,
              gia_tri,
              hoat_dong,
            };
      
            return Statis.updateOne({ _id: req.params.id }, updateData);
          })
          .then(() => {
            res.json({ message: 'Cập nhật thành công' });
          })
          .catch((error) => {
            console.error('Lỗi khi cập nhật statis:', error);
            res.status(500).json({ message: 'Lỗi khi cập nhật statis', error });
          });
      }
      
      trash(req, res, next) {
          // res.json(req.body)
      
          Statis.findDeleted({})
            .then((Statis) => {
              res.render('admin/statis/trash', { Statis: mutipleMongooseToObject(Statis) });
            })
      
            .catch(next);
        }
      // [DELETE]/Statis/:id
      destroy(req, res, next) {
        // res.json(req.body)
        Statis.delete({ _id: req.params.id })
          .then(() => res.redirect('back'))
          .catch(next);
      }
      // [DELETE]/Statis/:id/force
      force(req, res, next) {
        // res.json(req.body)
        Statis.deleteOne({ _id: req.params.id })
          .then(() => res.redirect('back'))
          .catch(next);
      }
      // [PATCH]/Statis/:id/restore
      restore(req, res, next) {
        Statis.restore({ _id: req.params.id })
          .then(() => res.redirect('back'))
          .catch(next);
      }
      //[PATCH]/khoa/handle-form-actions
        formaction(req, res, next) {
          switch (req.body.action) {
            case 'delete':
              Statis.delete({ _id: { $in: req.body.Ids } })
                .then(() => res.redirect('back'))
                .catch(next);
              break;
            case 'restore':
              Statis.restore({ _id: { $in: req.body.Ids } })
                .then(() => res.redirect('back'))
                .catch(next);
                break;  
            case 'force':
              Statis.deleteMany({ _id: { $in: req.body.Ids } })
                .then(() => res.redirect('back'))
                .catch(next);
                break;
            default:
              res.json({ message: 'Action is invalid' });
          }
          // res.json(req.body)
        }

  //   async statistics(req, res, next) {
  //     try {
  //         let matchCondition = {}; 
  //         if (req.query.type && req.query.type !== 'all') {
  //             matchCondition.type = new mongoose.Types.ObjectId(req.query.type);
  //         }
  
  //         let classifyCondition = {};
  //         if (req.query.classify && req.query.classify !== 'all') {
  //             classifyCondition["ourteamData.classify"] = req.query.classify;
  //         }
  
  //         const result = await Events.aggregate([
  //             { $match: matchCondition }, 
  //             { $unwind: { path: "$ourteam" } }, 
  //             { $match: { "ourteam": { $ne: null } } }, 
  //             {
  //                 $lookup: {
  //                     from: "ourteam", 
  //                     localField: "ourteam",
  //                     foreignField: "_id",
  //                     as: "ourteamData"
  //                 }
  //             },
  //             { $unwind: "$ourteamData" },
  //             { $match: classifyCondition }, // Lọc theo classify
  //             { $group: { _id: "$ourteam", count: { $sum: 1 } } }, 
  //             { $group: { _id: null, total: { $sum: 1 } } }
  //         ]);
  
  //         const totalCandidates = result.length ? result[0].total : 0;
  
  //         const types = await Type.find().lean().then(types => 
  //             types.map(type => ({ ...type, _id: type._id.toString() }))
  //         );
  
  //         res.render('admin/teststatistics', { 
  //             totalCandidates,
  //             selectedType: req.query.type ? req.query.type.toString() : 'all',
  //             selectedClassify: req.query.classify || 'all',
  //             types
  //         });
  //     } catch (error) {
  //         next(error);
  //     }
  // }

  async statistics(req, res, next) {
    try {
      const {
        mode = 'candidate',
        type = 'all',
        classify = 'all',
        year = 'all',
        specialized = 'all',
        degree = 'all',
        typeStudent = 'all',
        eventType = 'all',
        courseLanguage = 'all',
        status = 'all',
        roomStatus = 'all'
      } = req.query;
      
      const currentYear = new Date().getFullYear();
      const availableYearsR = [];

      for (let y = currentYear; y >= 2010; y--) {
        availableYearsR.push(String(y));
      }


      // Lấy tất cả các năm từ timeline.startDate
      const allYears = await Events.aggregate([
        {
          $project: {
            year: { $year: "$timeline.startDate" }
          }
        },
        { $group: { _id: "$year" } },
        { $sort: { _id: -1 } }
      ]);
      const availableYears = allYears
      .filter(item => item._id !== null)
      .map(item => item._id.toString());

  
      let dateCondition = {};
      
      if (year !== 'all') {
        const yearInt = parseInt(year);
        dateCondition["$or"] = [
          {
            "timeline.startDate": {
              $lte: new Date(`${yearInt + 1}-01-01T00:00:00.000Z`)
            },
            "timeline.endDate": {
              $gte: new Date(`${yearInt}-01-01T00:00:00.000Z`)
            }
          }
        ];
        
      }
      // const types = await Type.find().lean().then(types =>
      //   types.map(type => ({ ...type, _id: type._id.toString() }))
      // );
      const types = await Type.find().lean().then(types =>
        types
          .filter(type => type && type._id) // bỏ null/undefined hoặc không có _id
          .map(type => ({ ...type, _id: type._id.toString() }))
      );
      
  
      if (mode === 'candidate') {
        let matchCondition = {...dateCondition};
        if (type !== 'all') {
          matchCondition.type = new mongoose.Types.ObjectId(type);
        }
  
        let classifyCondition = {};
        if (classify !== 'all') {
          classifyCondition["ourteamData.classify"] = classify;
        }
        if (specialized !== 'all') {
          classifyCondition["ourteamData.specialized"] = specialized;
        }
        if (degree !== 'all') {
          classifyCondition["ourteamData.degree"] = degree;
        }
        if (typeStudent !== 'all') {
          classifyCondition["ourteamData.typeStudent"] = typeStudent;
        }
  
        const result = await Events.aggregate([
          { $match: matchCondition },
          { $unwind: "$ourteam" },
          { $match: { ourteam: { $ne: null } } },
          {
            $lookup: {
              from: "ourteam",
              localField: "ourteam",
              foreignField: "_id",
              as: "ourteamData"
            }
          },
          { $unwind: "$ourteamData" },
          { $match: classifyCondition },
          
          { $group: { _id: "$ourteam", count: { $sum: 1 } } },
          { $group: { _id: null, total: { $sum: 1 } } }
        ]);
  
        const totalCandidates = result.length ? result[0].total : 0;
  
        return res.render("admin/teststatistics", {
          selectedMode: mode,
          selectedType: type,
          selectedClassify: classify,
          selectedYear: year,   
          selectedSpecialized: specialized,
          selectedDegree: degree,
          selectedTypeStudent: typeStudent,
          totalCandidates,
          totalEvents: null,
          types,
          availableYears,  
        });
  
      } else if (mode === 'event') {
        let matchCondition = {...dateCondition};
        if (type !== 'all') {
          matchCondition.type = new mongoose.Types.ObjectId(type);
        }
        if (eventType !== 'all') {
          matchCondition.eventType = eventType;
        }
        if (courseLanguage !== 'all') {
          matchCondition.courseLanguage = courseLanguage;
        }
        if (status !== 'all') {
          matchCondition.status = status;
        }
  
        const result = await Events.aggregate([
          { $match: matchCondition },
          { $group: { _id: null, total: { $sum: 1 } } }
        ]);
  
        const totalEvents = result.length ? result[0].total : 0;
  
        return res.render("admin/teststatistics", {
          selectedMode: mode,
          selectedType: type,
          selectedClassify: classify,
          selectedYear: year,
          selectedEventType: eventType,
          selectedCourseLanguage: courseLanguage,
          selectedStatus: status,
          totalCandidates: null,
          totalEvents,
          types,
          availableYears,
        });
      } else if (mode === 'room') {
        const matchConditions = {};
      
        if (roomStatus !== 'all') {
          matchConditions.status = roomStatus;
        }
      
        // Lọc theo năm chỉ nếu là "Mới thành lập" hoặc "Nâng cấp"
        if (year !== 'all') {
          const start = new Date(`${year}-01-01`);
          const end = new Date(`${+year + 1}-01-01`);
      
          if (roomStatus === 'Mới thành lập') {
            matchConditions.establishedAt = { $gte: start, $lt: end };
          } else if (roomStatus === 'Nâng cấp') {
            matchConditions.upgradedAt = { $gte: start, $lt: end };
          } else {
            delete matchConditions.establishedAt;
            delete matchConditions.upgradedAt;
          }
        }
      
        const roomResult = await Room.aggregate([
          { $match: matchConditions },
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 }
            }
          }
        ]);
      
        const roomStats = roomResult.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {});
      
        const totalRooms = roomResult.reduce((sum, item) => sum + item.count, 0);
      
        return res.render("admin/teststatistics", {
          selectedMode: mode,
          selectedYear: year,
          totalRooms,
          roomStats,
          allStatuses: ['None', 'Cũ', 'Đang xây dựng', 'Mới thành lập', 'Nâng cấp'],
          availableYearsR,
          selectedRoomStatus: roomStatus,
          types,
        });
      }
      else if (mode === 'equipment') {
        const matchConditions = {};
      
        // Điều kiện lọc theo trạng thái phòng nếu có chọn
        if (roomStatus !== 'all') {
          matchConditions.status = roomStatus;
        }
      
        // Áp dụng lọc theo năm phù hợp với từng trạng thái
        if (year !== 'all') {
          const start = new Date(`${year}-01-01`);
          const end = new Date(`${+year + 1}-01-01`);
      
          if (roomStatus === 'Mới thành lập') {
            matchConditions.establishedAt = { $gte: start, $lt: end };
          } else if (roomStatus === 'Nâng cấp') {
            matchConditions.upgradedAt = { $gte: start, $lt: end };
          } else {
            // Trường hợp không phải hai trạng thái đó thì không lọc theo năm
            delete matchConditions.establishedAt;
            delete matchConditions.upgradedAt;
          }
        }
      
        const equipmentStats = await Room.aggregate([
          { $match: matchConditions },
          {
            $project: {
              status: 1,
              equipmentCount: { $size: "$equipment" }
            }
          },
          {
            $group: {
              _id: "$status",
              totalEquipment: { $sum: "$equipmentCount" }
            }
          }
        ]);
      
        const equipmentByStatus = equipmentStats.reduce((acc, curr) => {
          acc[curr._id] = curr.totalEquipment;
          return acc;
        }, {});
      
        const totalEquipment = equipmentStats.reduce((sum, curr) => sum + curr.totalEquipment, 0);
      
        return res.render("admin/teststatistics", {
          selectedMode: mode,
          selectedYear: year,
          selectedRoomStatus: roomStatus,
          totalEquipment,
          equipmentByStatus,
          allStatuses: ['None', 'Cũ', 'Đang xây dựng', 'Mới thành lập', 'Nâng cấp'],
          availableYearsR,
          types,
        });
      }      
      
    } catch (error) {
      next(error);
    }
  }
  // async statistics(req, res, next) {
  //   try {
  //     const { type = 'all', classify = 'all', statisType = 'candidate' } = req.query;
  
  //     let matchCondition = {};
  //     if (type !== 'all') {
  //       matchCondition.type = new mongoose.Types.ObjectId(type);
  //     }
  
  //     let dataList = [];
  //     let total = 0;
  
  //     if (statisType === 'candidate') {
  //       const pipeline = [
  //         { $match: matchCondition },
  //         { $unwind: "$ourteam" },
  //         { $match: { ourteam: { $ne: null } } },
  //         {
  //           $lookup: {
  //             from: "ourteam",
  //             localField: "ourteam",
  //             foreignField: "_id",
  //             as: "ourteamData"
  //           }
  //         },
  //         { $unwind: "$ourteamData" },
  //         ...(classify !== 'all' ? [{ $match: { "ourteamData.classify": classify } }] : []),
  //         {
  //           $group: {
  //             _id: "$ourteamData._id",
  //             name: { $first: "$ourteamData.vi_en.vi.name" }
  //           }
  //         },
  //         {
  //           $group: {
  //             _id: null,
  //             total: { $sum: 1 },
  //             people: { $push: "$name" }
  //           }
  //         }
  //       ];
  
  //       const result = await Events.aggregate(pipeline);
  //       total = result[0]?.total || 0;
  //       dataList = result[0]?.people || [];
  
  //     } else if (statisType === 'event') {
  //       const result = await Events.aggregate([
  //         { $match: matchCondition },
  //         {
  //           $project: {
  //             _id: 1,
  //             name: "$vi_en.vi.name"
  //           }
  //         }
  //       ]);
  //       total = result.length;
  //       dataList = result.map(item => item.name);
  //     }
  
  //     const types = await Type.find().lean().then(types => 
  //       types.map(type => ({ ...type, _id: type._id.toString() }))
  //     );
  
  //     res.render('admin/teststatistics', {
  //       selectedType: type,
  //       selectedClassify: classify,
  //       statisType,
  //       types,
  //       total,
  //       dataList
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  
}

module.exports = new StatisticsController();